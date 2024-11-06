import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: ['email', 'profile'],
    });
  } async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // 디버깅을 위한 로그 추가
    console.log('Access Token:', accessToken);  // Access Token 확인
    console.log('Refresh Token:', refreshToken);  // Refresh Token 확인
    console.log('Profile:', profile);  // 사용자 프로필 정보 확인

    // 이메일과 ID를 로그로 확인
    const { id, name, emails } = profile;
    console.log('Google User ID:', id);
    console.log('User Email:', emails[0].value);

    try {
      const providerId = id;
      const email = emails[0].value;

      // 사용자를 찾거나 새로운 사용자 생성
      const user: User = await this.userService.findByEmailOrSave(
        email,
        email,
        name.familyName + name.givenName,
        'google_oauth',
        providerId,
      );
      
      console.log('User successfully found or created:', user);

      return user;
    } catch (error) {
      // 에러가 발생하면 로그로 출력
      console.error('Error during validation:', error);
      throw error;  // 에러를 다시 던져서 상위 레이어에서 처리
    }
  }
}