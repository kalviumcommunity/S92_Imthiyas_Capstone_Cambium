import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AddInterestsDto } from './dto/user.dto';
import { JwtAuthGuard, AuthenticatedUser } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller(['api/users', 'api/v1/users'])
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private assertSelfOrAdmin(targetId: string, caller: AuthenticatedUser): void {
    if (caller.id !== targetId && caller.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Access denied: cannot access or modify another scholar account');
    }
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPLIANCE_OFFICER)
  @ApiOperation({ summary: 'Get all users (SuperAdmin & ComplianceOfficer only)' })
  @ApiResponse({ status: 200, description: 'List of users (sanitized)' })
  async getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get own user profile by ID (or SuperAdmin)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User profile details (sanitized)' })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    this.assertSelfOrAdmin(id, caller);
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a provisioned user profile (SuperAdmin only; public sign-up uses /api/auth/register)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post(':id/interests')
  @ApiOperation({ summary: 'Add normalized research interests to own user profile' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Research interests updated' })
  async addUserInterests(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddInterestsDto,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    this.assertSelfOrAdmin(id, caller);
    return this.usersService.addInterests(id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update own user profile (or SuperAdmin)' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    this.assertSelfOrAdmin(id, caller);
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete own user account or SuperAdmin erasure' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User profile deleted successfully' })
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() caller: AuthenticatedUser,
  ) {
    this.assertSelfOrAdmin(id, caller);
    return this.usersService.delete(id);
  }
}
