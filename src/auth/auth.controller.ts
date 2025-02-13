import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Request,
  Response,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from 'src/user/user.dto';
import {
  GoogleAuthGuard,
  signInGuard,
  JwtAuthGuard
} from './auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
@Controller('auth') 
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {} 


  @Post('signUp') 
  async signUp(@Body() userDto: CreateUserDto) {
    return await this.authService.signUp(userDto); 
  }
  
  //@UseGuards(signInGuard) 보안사항 생긴다면 가드를 이용하자
  @Post('signIn')
  async signIn(@Body() userDto: SignInUserDto) {
    // 1. 사용자 정보 확인
    const userInfo = await this.authService.validateUser(userDto.userId, userDto.password);
    
    //console.log('userinfo:',userInfo )
    if (!userInfo) {
      throw new UnauthorizedException('잘못된 사용자 정보입니다.');
    }

     // 2. 비밀번호 변경 기간 확인 (예: 6개월 경과 여부 확인) 및 초기화 여부 확인
    const isPasswordChangeRequired =
    userInfo.passwordReset || // 비밀번호 초기화 여부 확인
    this.authService.isPasswordChangeRequired(userInfo.passwordLastChanged, 6); // 마지막 변경일 확인

  
    // 3. JWT 토큰 생성
    const jwtToken = await this.authService.generateJwtToken(userInfo);
  
     // 4. 로그인 성공 응답
    return {
      access_token: jwtToken,
      message: '로그인 성공',
      passwordChangeRequired: isPasswordChangeRequired,
    };
  }
  @Patch('updatePassword')
  async updatePassword(@Body() userDto: SignInUserDto): Promise<void> {
    try {
      await this.authService.updatePassword(userDto);
    } catch (error) {
      console.error('Error updating password:', error);
      throw new HttpException('Failed to update password', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('to-google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user } = req;

    // DB에서 사용자 정보 조회
    const completeUser = await this.userService.findByEmail(user.email);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!completeUser || !completeUser.dob || !completeUser.gender || !completeUser.nationality) {
      res.redirect(`${frontendUrl}/googleSignUp?email=${user.email}&name=${user.username}`);
      return;
    }

    // ✅ 세션에 사용자 정보 저장
    req.session.user = {
      id: completeUser.id,
      userId: completeUser.userId,
      email: completeUser.email,
      username: completeUser.username,
    };

    console.log('세션 저장 완료:', req.session.user);
    res.redirect(`${frontendUrl}/`);
  }


  
  @Post('googleSignUp')
  async handleGoogleSignUp(@Body() body: any) {
    const { email, userId, dob, gender, nationality } = body;

    console.log('googlesignup body',body)
    try {
      // 서비스 호출
      const user = await this.userService.findByEmail(email);
      user.userId = userId;
      user.dob = dob;
      user.gender = gender;
      user.nationality = nationality;
      await this.userService.updateUser(user);
      // JWT 토큰 생성
      const jwtToken = await this.authService.generateJwtToken(user);
    
      return {
        access_token: jwtToken,
        message: '로그인 성공',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }    
    
    
  }
  

  @Get('profile')
  @UseGuards(JwtAuthGuard) 
  getProfile(@Request() req: Request) {
    const user = (req as any).user;
    console.log('어스컨트롤러160:',user);
    return { user };
  }  
  
  @Post('checkCurrentPassword')
  async checkCurrentPassword(@Body('userId') userId: string, @Body('password') password: string) {

    const userInfo = await this.authService.validateUser(userId, password);

    if (!userInfo) {
      throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
    }
    // 3. 비밀번호가 일치하면 성공 메시지 반환
    return { valid: true, message: '비밀번호가 일치합니다.' };
  }
}

