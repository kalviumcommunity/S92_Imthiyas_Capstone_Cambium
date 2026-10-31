import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupProject } from './entities/group-project.entity';
import { ProjectMember, CRediTRole } from './entities/project-member.entity';
import { ProjectActivityLog } from './entities/project-activity-log.entity';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(GroupProject)
    private readonly projectRepo: Repository<GroupProject>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    @InjectRepository(ProjectActivityLog)
    private readonly logRepo: Repository<ProjectActivityLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Create a new GitHub-style collaborative research workspace
   */
  async createProject(ownerId: string, dto: CreateProjectDto) {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Project owner profile not found.');
    }

    const project = this.projectRepo.create({
      ownerId,
      title: dto.title,
      description: dto.description || '',
      visibility: dto.visibility || 'PUBLIC',
      status: 'ACTIVE',
      targetGrantId: dto.targetGrantId,
      linkedDois: dto.linkedDois || [],
    });

    const savedProject = await this.projectRepo.save(project);

    // Automatically assign owner as Lead PI
    const leadMember = this.memberRepo.create({
      projectId: savedProject.id,
      userId: ownerId,
      creditRole: CRediTRole.LEAD_PI,
      status: 'ACCEPTED',
    });
    await this.memberRepo.save(leadMember);

    // Initial log
    await this.logActivity(
      savedProject.id,
      ownerId,
      'PROJECT_CREATED',
      `Workspace initialized by ${owner.fullName || 'Lead PI'}.`,
    );

    return {
      success: true,
      message: 'Research workspace initialized successfully.',
      data: savedProject,
    };
  }

  /**
   * Retrieve all projects where the scholar is an owner or member
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
   * Get single project details with CRediT member roster and activity changelog
   */
  async getProjectDetails(projectId: string) {
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
      },
      order: {
        activityLogs: {
          createdAt: 'DESC',
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found.`);
    }

    return {
      success: true,
      data: project,
    };
  }

  /**
   * Invite collaborator to project with specific CRediT authorship role
   */
  async inviteMember(projectId: string, requesterId: string, dto: InviteMemberDto) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: { members: true },
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
    }

    return {
      success: true,
      data: project.linkedDois,
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
