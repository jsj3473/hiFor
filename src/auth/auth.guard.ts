import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class signInGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // Authorization 헤더에서 토큰 확인
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        request.user = this.jwtService.verify(token);
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


@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: any): Promise<boolean> {
    return (await super.canActivate(context)) as boolean;
  }
}


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const result = (await super.canActivate(context)) as boolean;
    console.log('jwt전략66',result)
    // 인증에 실패한 경우 로그인 페이지로 리다이렉트
    if (!result) {
      // 브라우저 요청일 경우 리다이렉트 가능 (REST API가 아닌 웹 어플리케이션 상황)
      response.redirect('/login');
      return false;
    }
    return true;
  }
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // 세션에 userId가 있는지 확인
    if (!request.session || !(request.session as any).userId) {
      response.status(401).json({ message: '로그인이 필요합니다.' });
      return false;
    }


    // userId가 있으면 요청 통과
    return true;
  }
}
