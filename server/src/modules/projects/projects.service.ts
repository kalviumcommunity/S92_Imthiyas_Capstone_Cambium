import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Optional,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { GroupProject } from './entities/group-project.entity';
import { ProjectMember, CRediTRole } from './entities/project-member.entity';
import { ProjectActivityLog } from './entities/project-activity-log.entity';
import { WorkspaceComment } from './entities/workspace-comment.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { OutboxService } from '../../common/outbox/outbox.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsService } from '../events/events.service';
import { ChatGateway } from '../chat/chat.gateway';
import { ProductAnalyticsService } from '../analytics/product-analytics.service';

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
    @Optional()
    private readonly productAnalytics?: ProductAnalyticsService,
  ) {}

  private async runInTransaction<T>(
    work: (ctx: {
      projectRepo: Repository<GroupProject>;
      memberRepo: Repository<ProjectMember>;
      logRepo: Repository<ProjectActivityLog>;
      commentRepo?: Repository<WorkspaceComment>;
      notifRepo?: Repository<Notification>;
      emitOutbox: (aggType: string, aggId: string, eventType: string, payload: Record<string, any>) => Promise<any>;
    }) => Promise<T>,
  ): Promise<T> {
    if (this.dataSource) {
      return this.dataSource.transaction(async (manager: EntityManager) => {
        return work({
          projectRepo: manager.getRepository(GroupProject),
          memberRepo: manager.getRepository(ProjectMember),
          logRepo: manager.getRepository(ProjectActivityLog),
          commentRepo: manager.getRepository(WorkspaceComment),
          notifRepo: manager.getRepository(Notification),
          emitOutbox: (aggType, aggId, eventType, payload) =>
            this.outboxService
              ? this.outboxService.emitWithinTransaction(manager, aggType, aggId, eventType, payload)
              : Promise.resolve(null),
        });
      });
    }

    return work({
      projectRepo: this.projectRepo,
      memberRepo: this.memberRepo,
      logRepo: this.logRepo,
      commentRepo: this.commentRepo,
      emitOutbox: (aggType, aggId, eventType, payload) =>
        this.outboxService
          ? this.outboxService.emit(aggType, aggId, eventType, payload)
          : Promise.resolve(null),
    });
  }

  /**
   * Create a new collaborative research workspace within an atomic transaction.
   * Emits WORKSPACE_CREATED domain event to transactional outbox and logs activity.
   */
  async createProject(ownerId: string, dto: CreateProjectDto) {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Project owner profile not found.');
    }

    const savedProject = await this.runInTransaction(async (ctx) => {
      const project = ctx.projectRepo.create({
        ownerId,
        title: dto.title,
        description: dto.description || '',
        visibility: dto.visibility || 'PUBLIC',
        status: 'ACTIVE',
        targetGrantId: dto.targetGrantId,
        linkedDois: dto.linkedDois || [],
      });

      const created = await ctx.projectRepo.save(project);

      const leadMember = ctx.memberRepo.create({
        projectId: created.id,
        userId: ownerId,
        creditRole: CRediTRole.LEAD_PI,
        status: 'ACCEPTED',
      });
      await ctx.memberRepo.save(leadMember);

      const logEntry = ctx.logRepo.create({
        projectId: created.id,
        actorId: ownerId,
        action: 'PROJECT_CREATED',
        details: `Workspace initialized by ${owner.fullName || 'Lead PI'}.`,
      });
      await ctx.logRepo.save(logEntry);

      await ctx.emitOutbox('group_projects', created.id, 'WORKSPACE_CREATED', {
        projectId: created.id,
        room: `workspace:${created.id}`,
        ownerId,
        userId: ownerId,
        title: created.title,
        visibility: created.visibility,
        timestamp: new Date().toISOString(),
      });

      return created;
    });

    this.eventsService?.emit({
      type: 'notification',
      userId: ownerId,
      data: {
        title: 'Workspace Initialized',
        message: `Research workspace "${savedProject.title}" is live.`,
        projectId: savedProject.id,
      },
    });

    void this.productAnalytics?.recordBackendEvent({
      eventName: 'workspace.created',
      actorId: ownerId,
      actorEmail: owner.email,
      organizationId: owner.organizationId || null,
      workspaceId: savedProject.id,
      idempotencyKey: `workspace_created:${savedProject.id}`,
      properties: { visibility: savedProject.visibility },
    });

    return {
      success: true,
      message: 'Research workspace initialized successfully.',
      data: savedProject,
    };
  }

  /**
   * Retrieve all projects where the scholar is an accepted member plus pending invitations
   */
  async getUserProjects(userId: string) {
    const memberRecords = await this.memberRepo.find({
      where: [
        { userId, status: 'ACCEPTED' },
        { userId, status: 'INVITED' },
      ],
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
      myMembershipStatus: m.status,
    }));

    return {
      success: true,
      count: projects.length,
      data: projects,
    };
  }

  /**
   * Retrieve single project details with CRediT member roster and activity changelog.
   * Enforces tenant and member access boundaries for PRIVATE and LAB_ONLY research workspaces.
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

    if (project.visibility === 'PRIVATE' || project.visibility === 'LAB_ONLY') {
      if (!requesterId) {
        throw new ForbiddenException('Authentication required to access restricted research workspace.');
      }

      const isOwner = project.ownerId === requesterId;
      const isAcceptedMember = project.members?.some(
        (m) => m.userId === requesterId && m.status === 'ACCEPTED',
      );

      if (!isOwner && !isAcceptedMember) {
        throw new ForbiddenException(
          'Access to restricted research workspace denied. You are not an authorized member.',
        );
      }
    }

    return {
      success: true,
      data: project,
    };
  }

  async canUserAccessWorkspace(projectId: string, userId: string): Promise<boolean> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true },
    });
    if (!project) return false;
    if (project.ownerId === userId) return true;
    if (project.visibility === 'PUBLIC') return true;
    return Boolean(
      project.members?.some((m) => m.userId === userId && m.status === 'ACCEPTED'),
    );
  }

  /**
   * Check if a scholar is an active accepted member or owner of the workspace
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
   * Invite collaborator to project with specific CRediT authorship role inside an atomic transaction.
   */
  async inviteMember(projectId: string, requesterId: string, dto: InviteMemberDto) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true, owner: true },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    const isAcceptedMember = project.members.some(
      (m) => m.userId === requesterId && m.status === 'ACCEPTED',
    );
    if (!isAcceptedMember && project.ownerId !== requesterId) {
      throw new ForbiddenException('Only active project members can invite new collaborators.');
    }

    const invitee = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!invitee) {
      throw new NotFoundException('Invited researcher not found.');
    }

    const existingMember = await this.memberRepo.findOne({
      where: { projectId, userId: dto.userId },
    });

    if (existingMember && existingMember.status !== 'DECLINED') {
      throw new ConflictException('Scholar is already a member or has a pending invite.');
    }

    const assignedRole = dto.creditRole || CRediTRole.CO_AUTHOR;

    const newMember = await this.runInTransaction(async (ctx) => {
      let savedMember: ProjectMember;
      if (existingMember && existingMember.status === 'DECLINED') {
        existingMember.status = 'INVITED';
        existingMember.creditRole = assignedRole;
        savedMember = await ctx.memberRepo.save(existingMember);
      } else {
        const created = ctx.memberRepo.create({
          projectId,
          userId: dto.userId,
          creditRole: assignedRole,
          status: 'INVITED',
        });
        savedMember = await ctx.memberRepo.save(created);
      }

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: requesterId,
          action: 'INVITED_COLLABORATOR',
          details: `Invited ${invitee.fullName || 'Scholar'} as ${savedMember.creditRole}.`,
        }),
      );

      if (ctx.notifRepo) {
        await ctx.notifRepo.save(
          ctx.notifRepo.create({
            userId: dto.userId,
            message: `You were invited to collaborate on "${project.title}" as ${savedMember.creditRole}.`,
            type: 'WORKSPACE_INVITE',
            title: 'Collaboration Invitation',
            projectId,
            link: `/workspace?projectId=${projectId}`,
          } as any),
        );
      }

      await ctx.emitOutbox('project_members', savedMember.id, 'MEMBER_INVITED', {
        projectId,
        room: `workspace:${projectId}`,
        userId: dto.userId,
        creditRole: savedMember.creditRole,
        requesterId,
        timestamp: new Date().toISOString(),
      });

      return savedMember;
    });

    // Fallback when running unit tests without DataSource transaction
    if (!this.dataSource && this.notificationsService) {
      await this.notificationsService.create({
        user: dto.userId,
        message: `You were invited to collaborate on "${project.title}" as ${newMember.creditRole}.`,
      });
    }

    this.eventsService?.dispatchNotification(dto.userId, {
      title: 'Collaboration Invitation',
      message: `You were invited to "${project.title}" as ${newMember.creditRole}.`,
      projectId,
    });

    this.chatGateway?.broadcastMemberInvited?.(projectId, {
      id: newMember.id,
      userId: dto.userId,
      userName: invitee.fullName,
      creditRole: newMember.creditRole,
      status: 'INVITED',
    });

    void this.productAnalytics?.recordBackendEvent({
      eventName: 'workspace.member.invited',
      actorId: requesterId,
      workspaceId: projectId,
      idempotencyKey: `invite:${projectId}:${dto.userId}`,
      properties: { creditRole: newMember.creditRole },
    });

    return {
      success: true,
      message: `Invitation dispatched to ${invitee.fullName}.`,
      data: newMember,
    };
  }

  /**
   * Accept or decline a pending collaboration invitation
   */
  async respondToInvitation(projectId: string, userId: string, accept: boolean) {
    const member = await this.memberRepo.findOne({
      where: { projectId, userId },
      relations: { project: true, user: true },
    });

    if (!member) {
      throw new NotFoundException('Workspace invitation not found.');
    }
    if (member.status === 'ACCEPTED' && accept) {
      return { success: true, message: 'Invitation already accepted.', data: member };
    }

    const nextStatus = accept ? 'ACCEPTED' : 'DECLINED';
    const actionName = accept ? 'ACCEPTED_INVITE' : 'DECLINED_INVITE';
    const eventType = accept ? 'USER_JOINED_WORKSPACE' : 'MEMBER_DECLINED_INVITE';

    const updated = await this.runInTransaction(async (ctx) => {
      member.status = nextStatus;
      const saved = await ctx.memberRepo.save(member);

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: userId,
          action: actionName,
          details: `${member.user?.fullName || 'Collaborator'} ${accept ? 'accepted' : 'declined'} workspace invitation as ${member.creditRole}.`,
        }),
      );

      if (ctx.notifRepo && member.project?.ownerId && member.project.ownerId !== userId) {
        await ctx.notifRepo.save(
          ctx.notifRepo.create({
            userId: member.project.ownerId,
            message: `${member.user?.fullName || 'A collaborator'} ${accept ? 'joined' : 'declined'} "${member.project.title}".`,
            type: 'SYSTEM',
            title: accept ? 'Collaboration Accepted' : 'Invitation Declined',
            projectId,
            link: `/workspace?projectId=${projectId}`,
          } as any),
        );
      }

      await ctx.emitOutbox('project_members', saved.id, eventType, {
        projectId,
        room: `workspace:${projectId}`,
        userId: member.project?.ownerId || userId,
        actorId: userId,
        status: nextStatus,
        creditRole: member.creditRole,
        timestamp: new Date().toISOString(),
      });

      return saved;
    });

    this.chatGateway?.broadcastWorkspaceUpdated?.(projectId, {
      projectId,
      event: eventType,
      userId,
      status: nextStatus,
    });

    void this.productAnalytics?.recordBackendEvent({
      eventName: accept
        ? 'collaboration.invitation.accepted'
        : 'collaboration.invitation.declined',
      actorId: userId,
      actorEmail: member.user?.email,
      organizationId: member.user?.organizationId || null,
      workspaceId: projectId,
      idempotencyKey: `invite_resp:${projectId}:${userId}:${nextStatus}`,
      properties: { creditRole: member.creditRole },
    });

    return {
      success: true,
      message: accept ? 'Workspace invitation accepted.' : 'Workspace invitation declined.',
      data: updated,
    };
  }

  /**
   * Update collaborator CRediT role (Workspace Owner or Lead PI only)
   */
  async updateMemberRole(
    projectId: string,
    requesterId: string,
    memberUserId: string,
    creditRole: CRediTRole,
  ) {
    if (!Object.values(CRediTRole).includes(creditRole)) {
      throw new BadRequestException('Invalid CRediT authorship role.');
    }

    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    const requesterIsLead =
      project.ownerId === requesterId ||
      project.members?.some(
        (m) => m.userId === requesterId && m.status === 'ACCEPTED' && m.creditRole === CRediTRole.LEAD_PI,
      );
    if (!requesterIsLead) {
      throw new ForbiddenException('Only workspace owner or Lead PI can modify collaborator roles.');
    }

    const target = await this.memberRepo.findOne({ where: { projectId, userId: memberUserId } });
    if (!target) {
      throw new NotFoundException('Collaborator not found in workspace roster.');
    }

    const saved = await this.runInTransaction(async (ctx) => {
      const previousRole = target.creditRole;
      target.creditRole = creditRole;
      const updatedMember = await ctx.memberRepo.save(target);

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: requesterId,
          action: 'MEMBER_ROLE_CHANGED',
          details: `Updated collaborator ${memberUserId} role from ${previousRole} to ${creditRole}.`,
        }),
      );

      await ctx.emitOutbox('project_members', updatedMember.id, 'MEMBER_ROLE_CHANGED', {
        projectId,
        room: `workspace:${projectId}`,
        userId: memberUserId,
        requesterId,
        previousRole,
        creditRole,
        timestamp: new Date().toISOString(),
      });

      return updatedMember;
    });

    return {
      success: true,
      message: `Collaborator role updated to ${creditRole}.`,
      data: saved,
    };
  }

  /**
   * Retrieve paginated activity timeline for workspace
   */
  async getProjectActivity(
    projectId: string,
    requesterId: string,
    pagination?: { limit?: number; offset?: number },
  ) {
    await this.assertMemberOrOwner(projectId, requesterId);
    const limit = Math.min(Math.max(pagination?.limit || 50, 1), 100);
    const offset = Math.max(pagination?.offset || 0, 0);

    const [logs, total] = await this.logRepo.findAndCount({
      where: { projectId },
      relations: { actor: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      success: true,
      count: logs.length,
      total,
      data: logs,
    };
  }

  /**
   * Link an OpenAlex or PubMed DOI to the project's literature vault
   */
  async linkDoi(projectId: string, actorId: string, doi: string) {
    const project = await this.assertMemberOrOwner(projectId, actorId);

    if (!project.linkedDois) {
      project.linkedDois = [];
    }

    if (!project.linkedDois.includes(doi)) {
      await this.runInTransaction(async (ctx) => {
        project.linkedDois = [...project.linkedDois, doi];
        await ctx.projectRepo.save(project);

        await ctx.logRepo.save(
          ctx.logRepo.create({
            projectId,
            actorId,
            action: 'LINKED_LITERATURE',
            details: `Linked DOI reference: ${doi}.`,
          }),
        );

        await ctx.emitOutbox('group_projects', projectId, 'PUBLICATION_ADDED', {
          projectId,
          room: `workspace:${projectId}`,
          doi,
          actorId,
          timestamp: new Date().toISOString(),
        });
      });
    }

    return {
      success: true,
      data: project.linkedDois,
    };
  }

  /**
   * Update an existing research workspace with Optimistic Concurrency Control inside an atomic transaction.
   */
  async updateProject(projectId: string, requesterId: string, dto: UpdateProjectDto) {
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

    const saved = await this.runInTransaction(async (ctx) => {
      const updated = await ctx.projectRepo.save(project);

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: requesterId,
          action: 'UPDATED_WORKSPACE',
          details: `Workspace metadata updated (v${updated.version}).`,
        }),
      );

      await ctx.emitOutbox('group_projects', projectId, 'WORKSPACE_UPDATED', {
        projectId,
        room: `workspace:${projectId}`,
        title: updated.title,
        version: updated.version,
        requesterId,
        timestamp: new Date().toISOString(),
      });

      return updated;
    });

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
   * Add a threaded comment or peer-review critique to a workspace section inside an atomic transaction
   */
  async addComment(projectId: string, authorId: string, dto: CreateCommentDto) {
    const project = await this.assertMemberOrOwner(projectId, authorId);
    const author = await this.userRepo.findOne({ where: { id: authorId } });

    if (!this.commentRepo) {
      throw new NotFoundException('Comment repository is not initialized.');
    }

    const savedComment = await this.runInTransaction(async (ctx) => {
      const repo = ctx.commentRepo || this.commentRepo!;
      const created = repo.create({
        projectId,
        authorId,
        content: dto.content,
        sectionId: dto.sectionId,
        parentId: dto.parentId,
        isResolved: false,
      });

      const saved = await repo.save(created);

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: authorId,
          action: 'COMMENT_CREATED',
          details: `Comment added to ${dto.sectionId || 'general discussion'} by ${author?.fullName || 'Scholar'}.`,
        }),
      );

      if (ctx.notifRepo && project.ownerId !== authorId) {
        await ctx.notifRepo.save(
          ctx.notifRepo.create({
            userId: project.ownerId,
            message: `${author?.fullName || 'A collaborator'} commented on "${project.title}": "${dto.content.slice(0, 80)}..."`,
            type: 'COMMENT',
            title: 'New Workspace Comment',
            projectId,
            link: `/workspace?projectId=${projectId}`,
          } as any),
        );
      }

      await ctx.emitOutbox('workspace_comments', saved.id, 'COMMENT_CREATED', {
        projectId,
        room: `workspace:${projectId}`,
        commentId: saved.id,
        authorId,
        userId: project.ownerId !== authorId ? project.ownerId : undefined,
        sectionId: dto.sectionId,
        content: dto.content,
        timestamp: new Date().toISOString(),
      });

      return saved;
    });

    if (project.ownerId !== authorId) {
      if (!this.dataSource && this.notificationsService) {
        await this.notificationsService.create({
          user: project.ownerId,
          message: `${author?.fullName || 'A collaborator'} commented on "${project.title}": "${dto.content.slice(0, 80)}..."`,
        });
      }
      this.eventsService?.dispatchNotification(project.ownerId, {
        title: 'New Workspace Comment',
        message: `${author?.fullName || 'Scholar'} commented on ${dto.sectionId || 'workspace'}.`,
        projectId,
      });
    }

    const payload = {
      ...savedComment,
      author: {
        id: author?.id,
        fullName: author?.fullName,
        role: author?.role,
      },
    };

    this.chatGateway?.broadcastComment?.(projectId, payload);

    return {
      success: true,
      message: 'Comment posted successfully.',
      data: payload,
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

    const updated = await this.runInTransaction(async (ctx) => {
      const repo = ctx.commentRepo || this.commentRepo!;
      comment.isResolved = true;
      comment.resolvedById = resolverId;
      comment.resolvedAt = new Date();
      const saved = await repo.save(comment);

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: resolverId,
          action: 'COMMENT_RESOLVED',
          details: `Comment ${commentId} marked as resolved.`,
        }),
      );

      await ctx.emitOutbox('workspace_comments', commentId, 'COMMENT_RESOLVED', {
        projectId,
        room: `workspace:${projectId}`,
        commentId,
        resolverId,
        timestamp: new Date().toISOString(),
      });

      return saved;
    });

    this.chatGateway?.broadcastCommentResolved?.(projectId, commentId);

    return {
      success: true,
      message: 'Comment resolved successfully.',
      data: updated,
    };
  }

  /**
   * Retrieve all comments for a workspace (authorized members/owners only)
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

    await this.runInTransaction(async (ctx) => {
      await ctx.memberRepo.remove(member);

      await ctx.logRepo.save(
        ctx.logRepo.create({
          projectId,
          actorId: requesterId,
          action: 'REMOVED_COLLABORATOR',
          details: `Removed collaborator ${memberUserId} from workspace roster.`,
        }),
      );

      await ctx.emitOutbox('project_members', member.id, 'MEMBER_REMOVED', {
        projectId,
        room: `workspace:${projectId}`,
        userId: memberUserId,
        requesterId,
        timestamp: new Date().toISOString(),
      });
    });

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
  async logActivity(projectId: string, actorId: string, action: string, details: string) {
    const entry = this.logRepo.create({
      projectId,
      actorId,
      action,
      details,
    });
    return this.logRepo.save(entry);
  }
}
