import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import axios from 'axios';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: [
        'email', 
        'profile',
        'https://www.googleapis.com/auth/user.birthday.read', // 생일 정보
        'https://www.googleapis.com/auth/user.gender.read'    // 성별 정보
        ],
    });
  } 
  
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    const email = emails[0].value;
    
    // People API 호출
    try {
      const peopleApiResponse = await axios.get('https://people.googleapis.com/v1/people/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          personFields: 'birthdays,genders', // 가져올 필드
        },
      });
  
      // 생일과 성별 정보 추출
      const birthdays = peopleApiResponse.data.birthdays;
      const genders = peopleApiResponse.data.genders;
  
      const birthdayObj = birthdays?.[0]?.date || null;
      const gender = genders?.[0]?.value || null;

      // 생일 객체를 문자열로 변환 (예: YYYY-MM-DD)
      const birthday = birthdayObj
      ? `${birthdayObj.year}-${String(birthdayObj.month).padStart(2, '0')}-${String(birthdayObj.day).padStart(2, '0')}`
      : null;
  
      let user = await this.userService.findByEmail(email)

      if(!user){
        
        // 사용자 생성 또는 업데이트
        const NewUser: User = await this.userService.signUpToGoogle(
          id,
          email,
          name.familyName + name.givenName,
          birthday, 
          gender
        );

        return NewUser;
      }
      
  
  
      return user;
    } catch (error) {
      console.error('Error fetching additional user info:', error);
      throw error;
    }
  }
}