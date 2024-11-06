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

    // 2. 비밀번호 변경 기간 확인 (예: 6개월 경과 여부 확인)
    const isPasswordChangeRequired = this.authService.isPasswordChangeRequired(userInfo.passwordLastChanged, 6);
  
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
  async updatePassword(@Request() req, @Response() res, @Body() userDto: CreateUserDto) {
  try {
    const { userId, password, newPassword } = req.body;
    console.log(userId, password)
    // 1. 사용자 정보 확인
    const user = await this.authService.validateUser(userId, password);
    if (!user) {
      return res.status(401).send({ message: '현재 비밀번호가 올바르지 않습니다.' });
    }

    // 2. 새 비밀번호와 현재 비밀번호 비교
    if (password === newPassword) {
      return res.status(400).send({ message: '새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.' });
    }
    // 3. 사용자 객체 가져오기 (비밀번호 변경을 위해 비밀번호 필드가 포함된 객체 필요)
    const userToUpdate = await this.userService.getUser(userId);
    if (!userToUpdate) {
      return res.status(404).send({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 3. 비밀번호 업데이트   
    //await this.authService.updatePassword(userDto);

    // 4. 응답
    return res.send({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } 
  catch (error) {
    console.error('비밀번호 변경 오류:', error);
    return res.status(500).send({ message: '서버 오류가 발생했습니다. 다시 시도해주세요.' });
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

  // /auth/profile 엔드포인트: 사용자의 프로필 정보를 반환합니다.
  @Get('profile')
  @UseGuards(JwtAuthGuard) // JWT 인증을 적용하여 보호된 엔드포인트로 설정
  getProfile(@Request() req: Request) {
    // req.user는 JwtAuthGuard에 의해 설정된 인증된 사용자 정보를 포함합니다.
    console.log('1111')
    const user = (req as any).user;  
    console.log('1111',user)
    // 사용자 정보를 반환
    return { user };
  }
  
}

