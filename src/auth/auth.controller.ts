import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  UsePipes,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserModel } from '../users/model/createUser.model';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginModel } from '../users/model/login.model';
import { JwtPayload } from './interfaces/payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserModel: CreateUserModel,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserModel,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('login')
  public async login(@Body() loginModel: LoginModel): Promise<LoginStatus> {
    return await this.authService.login(loginModel);
  }

  @Get('whoami')
  @UseGuards(AuthGuard())
  public async testAuth(@Req() req: any): Promise<JwtPayload> {
    return req.user;
  }
}
