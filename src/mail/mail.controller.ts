import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { EmailService } from './mail.service'; // 이메일 전송을 담당하는 서비스
import { CacheService } from './cache.service'; // 인증번호 저장을 담당하는 서비스 (예: Redis)
import { UserService } from '../user/user.service';
import { FindPasswordDto } from 'src/user/user.dto';

@Controller('mail')
export class VerificationController {
  constructor(
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) {}

  @Post('sendVerification')
  async sendVerification(@Body('email') email: string) {
    //console.log('email in sverification',email)
    if (!email) {
      throw new BadRequestException('이메일을 입력해주세요.');
    }
    // 1. 인증번호 생성 (랜덤 6자리 숫자)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. 인증코드와 이메일을 임시 저장 (캐시 또는 DB에 저장)
    const verificationKey = `verification_${email}`;
    await this.cacheService.set(verificationKey, verificationCode, { ttl: 300 }); // 5분 유효 기간

    // 3. 이메일로 인증코드 전송
    await this.emailService.sendVerificationCode(email, verificationCode);

    return { verificationCode, message: '인증번호가 이메일로 전송되었습니다.' };
  }

  @Post('findPassword')
  async findPassword(@Body() findPasswordDto: FindPasswordDto) {
    const { userId, email } = findPasswordDto;

    // 1. 아이디와 이메일로 사용자 조회
    const user = await this.userService.findByUsernameAndEmail(userId, email);
    if (!user) {
      throw new NotFoundException('아이디와 이메일이 일치하는 사용자가 없습니다.');
    }

    // 2. 무작위 비밀번호 생성 및 이메일 전송
    const newPassword = Math.random().toString(36).slice(-8); // 무작위 8자리 비밀번호 생성
    await this.emailService.sendResetPasswordEmail(email, newPassword);

    // 3. 비밀번호를 임시로 저장하고, 초기화된 비밀번호 플래그 설정
    await this.userService.updatePasswordAndFlag(userId, newPassword);

    return { message: '임시 비밀번호가 이메일로 전송되었습니다. 임시 비밀번호로 로그인 해주세요' };
  }
}
