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
  
    // 사용자 데이터 확인 (DB에서 다시 조회)
    const completeUser = await this.userService.findByEmail(user.email);
    console.log('cuser:',completeUser)
  

  
    // Google 사용자 정보를 포함한 JWT 생성
    const jwtToken = await this.authService.googleGenerateJwtToken({
      id: user.id,
      userId: user.userId,
      email: user.email,
      username: user.username,
      dob: user.dob,
      gender: user.gender,
      nationality: user.nationality,
    });
    
    // JWT를 쿠키로 설정
    res.cookie('access_token', jwtToken.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1시간
    });

    if (completeUser && completeUser.nationality) {
      // 회원가입 완료된 경우 홈으로 리다이렉트
      res.redirect('http://localhost:8080/');
      return;
    }
    // 회원가입 페이지로 리다이렉트
    res.redirect(`http://localhost:8080/googleSignUp?token=${jwtToken.access_token}`);
  }  
  
  @Post('googleSignUp')
  async handleGoogleSignUp(@Body() body: any) {
    const { email, username, dob, gender, nationality } = body;

    console.log('googlesignup body',body)
    try {
      // 서비스 호출
      const user = await this.userService.findByEmail(email);
      console.log('수정전 유저:',user);
      user.username = username;
      user.dob = dob;
      user.gender = gender;
      user.nationality = nationality;
      await this.userService.updateUser(user);
      console.log('수정후 유저:',user);
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

