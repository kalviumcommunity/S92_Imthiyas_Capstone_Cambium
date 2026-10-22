import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard, AuthenticatedUser } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

const REFRESH_COOKIE_NAME = 'cambium_refresh_token';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: Response, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account with rotating refresh cookie' })
  @ApiResponse({ status: 201, description: 'User registered with JWT and HttpOnly refresh cookie' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username/email, sets HttpOnly refresh cookie' })
  @ApiResponse({ status: 200, description: 'Authenticated successfully with rotating token pair' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google Auth, sets HttpOnly refresh cookie' })
  @ApiResponse({ status: 200, description: 'Google authenticated successfully' })
  async googleLogin(@Body() dto: GoogleLoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.googleLogin(dto.token);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate and refresh JWT access token using HttpOnly cookie or body token' })
  @ApiBody({ required: false, schema: { properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Refreshed access token and rotated refresh cookie' })
  async refreshSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') bodyRefreshToken?: string,
  ) {
    const cookieToken = req.cookies ? req.cookies[REFRESH_COOKIE_NAME] : undefined;
    const token = cookieToken || bodyRefreshToken;

    const result = await this.authService.refreshSession(token);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user, blacklist refresh token in Redis, and clear cookies' })
  @ApiResponse({ status: 200, description: 'Tokens revoked in Redis and cookies cleared' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refreshToken') bodyRefreshToken?: string,
  ) {
    const cookieToken = req.cookies ? req.cookies[REFRESH_COOKIE_NAME] : undefined;
    const refreshToken = cookieToken || bodyRefreshToken;
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    this.clearRefreshCookie(res);
    return this.authService.logout(refreshToken, accessToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user profile' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.id);
  }
}
