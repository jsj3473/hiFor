import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class signInGuard implements CanActivate {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // Authorization 헤더에서 토큰 확인
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token);
        request.user = payload;
        return true;
      } catch (error) {
        return false;
      }
    }

    // 로그인 시도 시 이메일과 비밀번호 검증
    if (!request.body.email || !request.body.password) {
      return false;
    }

    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    if (!user) {
      return false;
    }

    const jwt = await this.authService.generateJwtToken(user);
    request.user = user;
    request.jwt = jwt; // 응답에 JWT 포함
    return true;
  }
}


//세션인증방식이므로 수정작업해야함
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: any): Promise<boolean> {
    console.log('guard before canActivate');
    const result = (await super.canActivate(context)) as boolean;
    console.log('result : ' + result);
    console.log('guard after canActivate');
    const request = context.switchToHttp().getRequest();
    console.log(request.session);
    await super.logIn(request); // 세션 옵션이 있으면 _passport.instance.serializeUser() 를 호출하여 세션을 req._passport.session.user 에 저장
    console.log(request.session);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('333');
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    return result;
  }
}


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    //console.log('2222')
    // 만약 인증이 성공했을 경우, 사용자 정보를 요청 객체에 설정
    if (result) {
      const user = request.user;
      request.user = user;
    }
    //console.log('22223')
    return result;
  }
}