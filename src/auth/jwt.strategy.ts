import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
              // 쿠키에서 'access_token'을 추출
              
        //console.log('Request Headers:', request.headers); // 요청 헤더 출력
        //console.log('Request Cookies:', request.cookies); // 모든 쿠키 출력
        
        //console.log('Extracted request cki access_token:', request.cookies?.access_token);
        const token = request?.cookies?.access_token || null;
        //console.log('Extracted Token:', token);
        return token;
      }]),
      ignoreExpiration: false,
      secretOrKey: '123', // 토큰 서명에 사용되는 비밀 키
    });
  }

  async validate(payload: any) {
    //console.log('Payload received in validate function:', payload);
    // 토큰에서 추출한 페이로드를 사용해 사용자 검증
    if (!payload) {
      //console.error('Invalid payload: Payload is null or undefined');
      throw new UnauthorizedException('Invalid JWT payload');
    }

    const user = await this.userService.getUser(payload.userId);
    if (!user) {
      //console.error('User not found with userId:', payload.userId);
      // 사용자가 없으면 인증 실패로 처리
      throw new UnauthorizedException();
    }
    // 인증된 사용자 정보를 반환
    //console.log('User authenticated successfully:', user);
    return { userId: user.userId, email: user.email };
  }
}
