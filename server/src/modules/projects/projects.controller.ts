import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { InviteMemberDto } from './dto/invite-member.dto';

@ApiTags('Collaborative Project Workspaces')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List user projects and research collaborations' })
  async getUserProjects(@Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.getUserProjects(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve project repository details with CRediT roster and activity' })
  async getProjectDetails(@Param('id') id: string, @Req() req: any) {
    const requesterId = req.user?.id || req.headers?.['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.getProjectDetails(id, requesterId);
  }

  @Post()
  @ApiOperation({ summary: 'Initialize new collaborative research project workspace' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProject(@Body() dto: CreateProjectDto, @Req() req: any) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.createProject(userId, dto);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite collaborator with CRediT authorship role' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async inviteMember(
    @Param('id') projectId: string,
    @Body() dto: InviteMemberDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.inviteMember(projectId, userId, dto);
  }

  @Post(':id/link-doi')
  @ApiOperation({ summary: 'Link OpenAlex / PubMed DOI to project literature vault' })
  async linkDoi(
    @Param('id') projectId: string,
    @Body('doi') doi: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    return this.projectsService.linkDoi(projectId, userId, doi);
  }
}
