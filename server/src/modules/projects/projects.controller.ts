import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CRediTRole } from './entities/project-member.entity';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Collaborative Project Workspaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(['projects', 'api/projects', 'api/v1/projects'])
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List authenticated scholar projects and pending invitations' })
  async getUserProjects(@CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.getUserProjects(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve project repository details with CRediT roster and activity' })
  async getProjectDetails(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.getProjectDetails(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Initialize new collaborative research project workspace' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProject(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.createProject(user.id, dto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite collaborator with CRediT authorship role' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async inviteMember(
    @Param('id') projectId: string,
    @Body() dto: InviteMemberDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.inviteMember(projectId, user.id, dto);
  }

  @Post(':id/invitations/accept')
  @ApiOperation({ summary: 'Accept pending workspace collaboration invitation' })
  async acceptInvitation(@Param('id') projectId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.respondToInvitation(projectId, user.id, true);
  }

  @Post(':id/invitations/decline')
  @ApiOperation({ summary: 'Decline pending workspace collaboration invitation' })
  async declineInvitation(@Param('id') projectId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.respondToInvitation(projectId, user.id, false);
  }

  @Patch(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Update collaborator CRediT role (Workspace Owner or Lead PI only)' })
  async updateMemberRole(
    @Param('id') projectId: string,
    @Param('memberId') memberUserId: string,
    @Body('creditRole') creditRole: CRediTRole,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.updateMemberRole(projectId, user.id, memberUserId, creditRole);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Retrieve paginated activity timeline for workspace' })
  async getProjectActivity(
    @Param('id') projectId: string,
    @Query('limit') limit: string | undefined,
    @Query('offset') offset: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.getProjectActivity(projectId, user.id, {
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Post(':id/link-doi')
  @ApiOperation({ summary: 'Link OpenAlex / PubMed DOI to project literature vault' })
  async linkDoi(
    @Param('id') projectId: string,
    @Body('doi') doi: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.linkDoi(projectId, user.id, doi);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update research workspace metadata with optimistic concurrency control' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProject(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.updateProject(projectId, user.id, dto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List threaded comments and methodology critiques for workspace' })
  async getProjectComments(
    @Param('id') projectId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.getProjectComments(projectId, user.id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add section comment or peer review critique to workspace' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async addComment(
    @Param('id') projectId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.addComment(projectId, user.id, dto);
  }

  @Put(':id/comments/:commentId/resolve')
  @ApiOperation({ summary: 'Resolve threaded peer review comment' })
  async resolveComment(
    @Param('id') projectId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.resolveComment(projectId, commentId, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete or archive research workspace (Owner only)' })
  async deleteProject(@Param('id') projectId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.deleteProject(projectId, user.id);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove collaborator from workspace roster' })
  async removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectsService.removeMember(projectId, user.id, memberId);
  }
}
