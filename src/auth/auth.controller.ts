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
  AuthenticatedGuard,
  GoogleAuthGuard,
  LocalAuthGuard,
  signInGuard,
  JwtAuthGuard
} from './auth.guard';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth') 
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {} 


  @Post('signUp') // ❸ register 주소로 POST로 온 요청을 처리
  // ❹ class-validator 가 자동으로 유효성검증
  async signUp(@Body() userDto: CreateUserDto) {
    return await this.authService.signUp(userDto); // ❺ authService를 사용하여 user정보를 저장
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
  
    // JWT 생성
    const jwtToken = this.authService.generateJwtToken(user);

    //console.log('jwtToken in g controller:',jwtToken)
      // JWT 토큰을 쿠키에 설정 (HTTP-only 쿠키로 설정하여 클라이언트 측에서는 접근 불가)
    res.cookie('access_token', (await jwtToken).access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // 배포 환경에서는 secure 옵션 사용
      maxAge: 3600000, // 1시간 (밀리초)
    });

    //console.log('Cookie set with JWT Token:', jwtToken);
    //console.log('Cookie set with JWT Token (access_token):', res.getHeader('Set-Cookie'));
    
    // 프론트엔드로 리다이렉트
    res.redirect('http://localhost:8080');
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) 
  getProfile(@Request() req: Request) {
    const user = (req as any).user;  
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

