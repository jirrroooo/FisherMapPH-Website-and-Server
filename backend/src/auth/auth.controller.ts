import {
  Controller,
  Body,
  Post,
  Res,
  Req,
  UnauthorizedException,
  Get,
  UseGuards,
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/logIn.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('profile/:id')
  @UseGuards(AuthGuard())
  getUserId(@Param('id') token: string): Promise<{}> {
    return this.authService.profile(token);
  }

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ status: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(
    @Body() logInDto: LogInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    token: string;
    isAuthenticated: boolean
  }> {
    return this.authService.login(logInDto);
  }

  // @Post('/logout')
  // logout(@Res({passthrough: true}) response : Response) {
  //     response.clearCookie("token");

  //     return { status : "success"} ;
  // }

  @Get('/verify-cookie')
  async verifyCookie(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    try {
      const cookie = request.cookies['token'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }
}
