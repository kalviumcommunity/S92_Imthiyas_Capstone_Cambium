import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InstitutionService } from './institution.service';
import { CreateDepartmentDto } from './dto/institution.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Institutional Command Centre')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/institution')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Executive Research Command Centre KPI overview (tenant-scoped)' })
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.institutionService.getCommandCentreOverview(user);
  }

  @Get('departments')
  @ApiOperation({ summary: 'List institutional research departments' })
  listDepartments(@CurrentUser() user: AuthenticatedUser) {
    return this.institutionService.listDepartments(user);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create institutional research department (Leadership / R&D Director)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createDepartment(
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.institutionService.createDepartment(user, dto);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export structured institutional KPI & financial governance report' })
  async exportReport(@CurrentUser() user: AuthenticatedUser) {
    const overview = await this.institutionService.getCommandCentreOverview(user);
    return {
      reportType: 'CAMBIUM_INSTITUTIONAL_GOVERNANCE_SNAPSHOT',
      exportedAt: new Date().toISOString(),
      ...overview,
    };
  }
}
