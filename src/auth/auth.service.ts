import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable() // ❶ 프로바이더로 사용
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService, // JwtService 주입
  ) {} // ❷ 생성자에서 UserService를 주입 받음.

  // ❸ 함수내부에 await 구문이 있으므로 async가 필요
  async signUp(userDto: CreateUserDto) {

    // ❻ 패드워드 암호화
    const encryptedPassword = bcrypt.hashSync(userDto.password, 10);

    // ❼ 디비에 저장. 저장중 에러가 나면 서버에러 발생
    try {
      const user = await this.userService.createUser({
        ...userDto,
        password: encryptedPassword,
      });
      // ❽회원가입 후 반환하는 값에는 password를 주지 않음
      user.password = undefined;
      return user;
    } catch (error) {
      console.log('error:',error)
      throw new HttpException('서버에러', 500);
    }
  }

  async validateUser(userId: string, password: string) {
    const user = await this.userService.getUser(userId);
    //console.log('user in v',user);
    if (!user) {
      return null;
    }

    const { password: hashedPassword, ...userInfo } = user;
    //console.log('pw:',password);
    //console.log('hpw:',hashedPassword)
    if (await bcrypt.compare(password, hashedPassword)) {
      return userInfo;
    }
    return null;
  }

  async generateJwtToken(user: any) {
    const payload = { email: user.email, userId: user.userId };
    const token = this.jwtService.sign(payload);
    //console.log('Generated JWT Token:', token); // 생성된 토큰 확인
    return {
      access_token: token,
    };
  }
  // 비밀번호 변경이 필요한지 확인하는 함수
  isPasswordChangeRequired(passwordLastChanged: Date, months: number = 6): boolean {
    const now = new Date();
    const durationInMs = months * 30 * 24 * 60 * 60 * 1000; // 지정한 개월 수의 밀리초
    return new Date(passwordLastChanged).getTime() < now.getTime() - durationInMs;
  }  
  

  async updatePassword(userDto: SignInUserDto): Promise<void> {
    try {
      const { userId, password } = userDto;

      // 2. 새로운 비밀번호 해시화
      const hashedPassword = bcrypt.hashSync(password, 10);

      // 3. 비밀번호 업데이트
      await this.userService.updateUserPassword(userId, hashedPassword);
    } catch (error) {
      console.error;
      throw new BadRequestException('비밀번호 업데이트 중 오류가 발생했습니다.');
    }
  }
}
