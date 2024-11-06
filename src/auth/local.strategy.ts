import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 토큰 추출
      ignoreExpiration: false,
      secretOrKey: '123', // 토큰 서명에 사용되는 비밀 키
    });
  }

  async validate(payload: any) {
    // 토큰에서 추출한 페이로드를 사용해 사용자 검증
    const user = await this.UserService.getUser(payload.userId);
    if (!user) {
      return null;
    }
    return { userId: user.userId, email: user.email }; // JWT 페이로드에서 필요한 사용자 정보 반환
  }
}
