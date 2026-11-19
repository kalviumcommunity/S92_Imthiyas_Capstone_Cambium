import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Optional,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GroupProject } from './entities/group-project.entity';
import { ProjectMember, CRediTRole } from './entities/project-member.entity';
import { ProjectActivityLog } from './entities/project-activity-log.entity';
import { WorkspaceComment } from './entities/workspace-comment.entity';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { OutboxService } from '../../common/outbox/outbox.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsService } from '../events/events.service';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(GroupProject)
    private readonly projectRepo: Repository<GroupProject>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    @InjectRepository(ProjectActivityLog)
    private readonly logRepo: Repository<ProjectActivityLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Optional()
    @InjectRepository(WorkspaceComment)
    private readonly commentRepo?: Repository<WorkspaceComment>,
    @Optional()
    private readonly outboxService?: OutboxService,
    @Optional()
    private readonly notificationsService?: NotificationsService,
    @Optional()
    private readonly eventsService?: EventsService,
    @Optional()
    private readonly chatGateway?: ChatGateway,
    @Optional()
    private readonly dataSource?: DataSource,
  ) {}

  /**
   * Create a new collaborative research workspace within an atomic transaction.
   * Emits WORKSPACE_CREATED domain event to transactional outbox and logs activity.
   */
  async createProject(ownerId: string, dto: CreateProjectDto) {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Project owner profile not found.');
    }

    const executeCreation = async (managerOrRepos: {
      projectRepo: Repository<GroupProject>;
      memberRepo: Repository<ProjectMember>;
      logRepo: Repository<ProjectActivityLog>;
      emitOutbox?: (type: string, id: string, ev: string, payload: any) => Promise<any>;
    }) => {
      const project = managerOrRepos.projectRepo.create({
        ownerId,
        title: dto.title,
        description: dto.description || '',
        visibility: dto.visibility || 'PUBLIC',
        status: 'ACTIVE',
        targetGrantId: dto.targetGrantId,
        linkedDois: dto.linkedDois || [],
      });

      const savedProject = await managerOrRepos.projectRepo.save(project);

      // Automatically assign creator as Lead PI
      const leadMember = managerOrRepos.memberRepo.create({
        projectId: savedProject.id,
        userId: ownerId,
        creditRole: CRediTRole.LEAD_PI,
        status: 'ACCEPTED',
      });
      await managerOrRepos.memberRepo.save(leadMember);

      // Initial activity log
      const logEntry = managerOrRepos.logRepo.create({
        projectId: savedProject.id,
        actorId: ownerId,
        action: 'PROJECT_CREATED',
        details: `Workspace initialized by ${owner.fullName || 'Lead PI'}.`,
      });
      await managerOrRepos.logRepo.save(logEntry);

      // Stage in transactional outbox
      if (managerOrRepos.emitOutbox) {
        await managerOrRepos.emitOutbox(
          'group_projects',
          savedProject.id,
          'WORKSPACE_CREATED',
          {
            ownerId,
            title: savedProject.title,
            visibility: savedProject.visibility,
            timestamp: new Date().toISOString(),
          },
        );
      }

      return savedProject;
    };

    let savedProject: GroupProject;

    if (this.dataSource) {
      savedProject = await this.dataSource.transaction(async (manager) => {
        return executeCreation({
          projectRepo: manager.getRepository(GroupProject),
          memberRepo: manager.getRepository(ProjectMember),
          logRepo: manager.getRepository(ProjectActivityLog),
          emitOutbox: this.outboxService
            ? (aggType, aggId, eventType, payload) =>
                this.outboxService!.emitWithinTransaction(manager, aggType, aggId, eventType, payload)
            : undefined,
        });
      });
    } else {
      savedProject = await executeCreation({
        projectRepo: this.projectRepo,
        memberRepo: this.memberRepo,
        logRepo: this.logRepo,
        emitOutbox: this.outboxService
          ? (aggType, aggId, eventType, payload) =>
              this.outboxService!.emit(aggType, aggId, eventType, payload)
          : undefined,
      });
    }

    // Post-commit real-time event broadcast
    this.eventsService?.emit({
      type: 'notification',
      userId: ownerId,
      data: {
        title: 'Workspace Initialized',
        message: `Research workspace "${savedProject.title}" is live.`,
        projectId: savedProject.id,
      },
    });

    return {
      success: true,
      message: 'Research workspace initialized successfully.',
      data: savedProject,
    };
  }

  /**
   * Retrieve all projects where the scholar is an owner or accepted member
   */
  async getUserProjects(userId: string) {
    const memberRecords = await this.memberRepo.find({
      where: { userId, status: 'ACCEPTED' },
      relations: {
        project: {
          owner: true,
          members: {
            user: true,
          },
        },
      },
      order: {
        joinedAt: 'DESC',
      },
    });

    const projects = memberRecords.map((m) => ({
      ...m.project,
      myRole: m.creditRole,
    }));

    return {
      success: true,
      count: projects.length,
      data: projects,
    };
  }

  /**
   * Get single project details with CRediT member roster and activity changelog.
   * Enforces tenant and member access boundaries for PRIVATE research workspaces.
   */
  async getProjectDetails(projectId: string, requesterId?: string) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: {
        owner: true,
        members: {
          user: true,
        },
        activityLogs: {
          actor: true,
        },
        comments: {
          author: true,
        },
      },
      order: {
        activityLogs: {
          createdAt: 'DESC',
        },
        comments: {
          createdAt: 'ASC',
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    // Zero-Trust Private Workspace ACL Check
    if (project.visibility === 'PRIVATE') {
      if (!requesterId) {
        throw new ForbiddenException('Authentication required to access private research workspace.');
      }

      const isOwner = project.ownerId === requesterId;
      const isAcceptedMember = project.members?.some(
        (m) => m.userId === requesterId && m.status === 'ACCEPTED',
      );

      if (!isOwner && !isAcceptedMember) {
        throw new ForbiddenException(
          'Access to private research workspace denied. You are not an authorized member.',
        );
      }
    }

    return {
      success: true,
      data: project,
    };
  }

  /**
   * Check if a scholar is an active member or owner of the workspace
   */
  async assertMemberOrOwner(projectId: string, userId: string): Promise<GroupProject> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    const isOwner = project.ownerId === userId;
    const isMember = project.members?.some(
      (m) => m.userId === userId && m.status === 'ACCEPTED',
    );

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        `User ${userId} does not have access permissions for workspace ${projectId}.`,
      );
    }

    return project;
  }

  /**
   * Invite collaborator to project with specific CRediT authorship role.
   * Dispatches persistent notification and broadcasts live event.
   */
  async inviteMember(projectId: string, requesterId: string, dto: InviteMemberDto) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true, owner: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    const requesterMember = project.members.find((m) => m.userId === requesterId);
    if (!requesterMember && project.ownerId !== requesterId) {
      throw new ForbiddenException('Only project members can invite new collaborators.');
    }

    const invitee = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!invitee) {
      throw new NotFoundException('Invited researcher not found.');
    }

    const existingMember = await this.memberRepo.findOne({
      where: { projectId, userId: dto.userId },
    });

    if (existingMember) {
      throw new ConflictException('Scholar is already a member or has a pending invite.');
    }

    const newMember = this.memberRepo.create({
      projectId,
      userId: dto.userId,
      creditRole: dto.creditRole || CRediTRole.CO_AUTHOR,
      status: 'INVITED',
    });

    await this.memberRepo.save(newMember);

    await this.logActivity(
      projectId,
      requesterId,
      'INVITED_COLLABORATOR',
      `Invited ${invitee.fullName || 'Scholar'} as ${newMember.creditRole}.`,
    );

    // Transactional outbox event
    if (this.outboxService) {
      await this.outboxService.emit(
        'project_members',
        newMember.id,
        'MEMBER_INVITED',
        {
          projectId,
          userId: dto.userId,
          creditRole: newMember.creditRole,
          requesterId,
          timestamp: new Date().toISOString(),
        },
      );
    }

    // Persistent notification for invited researcher
    if (this.notificationsService) {
      await this.notificationsService.create({
        user: dto.userId,
        message: `You were invited to collaborate on "${project.title}" as ${newMember.creditRole}.`,
      });
    }

    // Real-time notification dispatch
    this.eventsService?.dispatchNotification(dto.userId, {
      title: 'Collaboration Invitation',
      message: `You were invited to "${project.title}" as ${newMember.creditRole}.`,
      projectId,
    });

    // Broadcast update to workspace room participants
    this.chatGateway?.broadcastMemberInvited?.(projectId, {
      id: newMember.id,
      userId: dto.userId,
      userName: invitee.fullName,
      creditRole: newMember.creditRole,
      status: 'INVITED',
    });

    return {
      success: true,
      message: `Invitation dispatched to ${invitee.fullName}.`,
      data: newMember,
    };
  }

  /**
   * Link an OpenAlex or PubMed DOI to the project's literature vault
   */
  async linkDoi(projectId: string, actorId: string, doi: string) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    if (!project.linkedDois) {
      project.linkedDois = [];
    }

    if (!project.linkedDois.includes(doi)) {
      project.linkedDois.push(doi);
      await this.projectRepo.save(project);

      await this.logActivity(
        projectId,
        actorId,
        'LINKED_LITERATURE',
        `Linked DOI reference: ${doi}.`,
      );

      // Emit domain event
      this.outboxService?.emit(
        'group_projects',
        projectId,
        'PUBLICATION_ADDED',
        { projectId, doi, actorId },
      );
    }

    return {
      success: true,
      data: project.linkedDois,
    };
  }

  /**
   * Update an existing research workspace with Optimistic Concurrency Control.
   * If version token is supplied, ensures no concurrent writer has updated the workspace.
   */
  async updateProject(
    projectId: string,
    requesterId: string,
    dto: UpdateProjectDto,
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    const isOwner = project.ownerId === requesterId;
    const isAcceptedMember = project.members?.some(
      (m) => m.userId === requesterId && m.status === 'ACCEPTED',
    );

    if (!isOwner && !isAcceptedMember) {
      throw new ForbiddenException('Only project owners or active members can update this workspace.');
    }

    // Optimistic Concurrency Check
    if (dto.version !== undefined && project.version !== undefined && project.version !== dto.version) {
      throw new ConflictException(
        `Optimistic Concurrency Conflict: Workspace has been modified by another collaborator (current version: ${project.version}, requested version: ${dto.version}). Please refresh before saving.`,
      );
    }

    if (dto.title !== undefined) project.title = dto.title;
    if (dto.description !== undefined) project.description = dto.description;
    if (dto.visibility !== undefined) project.visibility = dto.visibility as any;
    if (dto.status !== undefined) project.status = dto.status;
    if (dto.targetGrantId !== undefined) project.targetGrantId = dto.targetGrantId;
    if (dto.linkedDois !== undefined) project.linkedDois = dto.linkedDois;

    const saved = await this.projectRepo.save(project);

    await this.logActivity(
      projectId,
      requesterId,
      'UPDATED_WORKSPACE',
      `Workspace metadata updated.`,
    );

    // Transactional outbox event
    this.outboxService?.emit(
      'group_projects',
      projectId,
      'WORKSPACE_UPDATED',
      {
        projectId,
        title: saved.title,
        version: saved.version,
        requesterId,
        timestamp: new Date().toISOString(),
      },
    );

    // Live broadcast to room
    this.chatGateway?.broadcastWorkspaceUpdated?.(projectId, {
      projectId,
      title: saved.title,
      version: saved.version,
      updatedAt: saved.updatedAt,
    });

    return {
      success: true,
      message: 'Research workspace updated successfully.',
      data: saved,
    };
  }

  /**
   * Add a threaded comment or peer-review critique to a workspace section
   */
  async addComment(projectId: string, authorId: string, dto: CreateCommentDto) {
    const project = await this.assertMemberOrOwner(projectId, authorId);
    const author = await this.userRepo.findOne({ where: { id: authorId } });

    if (!this.commentRepo) {
      throw new NotFoundException('Comment repository is not initialized.');
    }

    const comment = this.commentRepo.create({
      projectId,
      authorId,
      content: dto.content,
      sectionId: dto.sectionId,
      parentId: dto.parentId,
      isResolved: false,
    });

    const savedComment = await this.commentRepo.save(comment);

    await this.logActivity(
      projectId,
      authorId,
      'COMMENT_CREATED',
      `Comment added to ${dto.sectionId || 'general discussion'} by ${author?.fullName || 'Scholar'}.`,
    );

    // Outbox event
    this.outboxService?.emit(
      'workspace_comments',
      savedComment.id,
      'COMMENT_CREATED',
      {
        projectId,
        commentId: savedComment.id,
        authorId,
        sectionId: dto.sectionId,
        content: dto.content,
      },
    );

    // Notify project owner if author is a collaborator
    if (project.ownerId !== authorId && this.notificationsService) {
      await this.notificationsService.create({
        user: project.ownerId,
        message: `${author?.fullName || 'A collaborator'} commented on "${project.title}": "${dto.content.slice(0, 80)}..."`,
      });
      this.eventsService?.dispatchNotification(project.ownerId, {
        title: 'New Workspace Comment',
        message: `${author?.fullName || 'Scholar'} commented on ${dto.sectionId || 'workspace'}.`,
        projectId,
      });
    }

    // Broadcast to room
    this.chatGateway?.broadcastComment?.(projectId, {
      ...savedComment,
      author: {
        id: author?.id,
        fullName: author?.fullName,
        role: author?.role,
      },
    });

    return {
      success: true,
      message: 'Comment posted successfully.',
      data: {
        ...savedComment,
        author: {
          id: author?.id,
          fullName: author?.fullName,
          role: author?.role,
        },
      },
    };
  }

  /**
   * Resolve an existing comment or peer review thread
   */
  async resolveComment(projectId: string, commentId: string, resolverId: string) {
    await this.assertMemberOrOwner(projectId, resolverId);

    if (!this.commentRepo) {
      throw new NotFoundException('Comment repository is not initialized.');
    }

    const comment = await this.commentRepo.findOne({
      where: { id: commentId, projectId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment ${commentId} not found in workspace.`);
    }

    comment.isResolved = true;
    comment.resolvedById = resolverId;
    comment.resolvedAt = new Date();

    const updated = await this.commentRepo.save(comment);

    await this.logActivity(
      projectId,
      resolverId,
      'COMMENT_RESOLVED',
      `Comment ${commentId} marked as resolved.`,
    );

    this.outboxService?.emit(
      'workspace_comments',
      commentId,
      'COMMENT_RESOLVED',
      { projectId, commentId, resolverId },
    );

    this.chatGateway?.broadcastCommentResolved?.(projectId, commentId);

    return {
      success: true,
      message: 'Comment resolved successfully.',
      data: updated,
    };
  }

  /**
   * Retrieve all comments for a workspace
   */
  async getProjectComments(projectId: string, requesterId?: string) {
    if (requesterId) {
      await this.assertMemberOrOwner(projectId, requesterId);
    }

    if (!this.commentRepo) {
      return { success: true, count: 0, data: [] };
    }

    const comments = await this.commentRepo.find({
      where: { projectId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });

    return {
      success: true,
      count: comments.length,
      data: comments,
    };
  }

  /**
   * Delete or archive a research workspace (Owner only)
   */
  async deleteProject(projectId: string, requesterId: string) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true, activityLogs: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    if (project.ownerId !== requesterId) {
      throw new ForbiddenException('Only the designated workspace Owner can delete this project.');
    }

    await this.projectRepo.remove(project);

    return {
      success: true,
      message: 'Research workspace and associated collaboration roster deleted successfully.',
      projectId,
    };
  }

  /**
   * Remove a collaborator from a research project workspace
   */
  async removeMember(projectId: string, requesterId: string, memberUserId: string) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    const isOwner = project.ownerId === requesterId;
    const isSelf = requesterId === memberUserId;

    if (!isOwner && !isSelf) {
      throw new ForbiddenException('Only the workspace owner can remove collaborators.');
    }

    const member = await this.memberRepo.findOne({
      where: { projectId, userId: memberUserId },
    });

    if (!member) {
      throw new NotFoundException('Collaborator not found in workspace roster.');
    }

    await this.memberRepo.remove(member);

    await this.logActivity(
      projectId,
      requesterId,
      'REMOVED_COLLABORATOR',
      `Removed collaborator ${memberUserId} from workspace roster.`,
    );

    return {
      success: true,
      message: 'Collaborator removed from workspace successfully.',
      projectId,
      userId: memberUserId,
    };
  }

  /**
   * Append an immutable entry to the project activity changelog
   */
  async logActivity(
    projectId: string,
    actorId: string,
    action: string,
    details: string,
  ) {
    const entry = this.logRepo.create({
      projectId,
      actorId,
      action,
      details,
    });
    return this.logRepo.save(entry);
  }
}
