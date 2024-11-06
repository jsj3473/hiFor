import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailService } from './mail.service'; // 이메일 전송을 담당하는 서비스
import { CacheService } from './cache.service'; // 인증번호 저장을 담당하는 서비스 (예: Redis)
import { v4 as uuidv4 } from 'uuid';

@Controller('mail')
export class VerificationController {
  constructor(
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  @Post('sendVerification')
  async sendVerification(@Body('email') email: string) {
    console.log('email in sverification',email)
    if (!email) {
      throw new BadRequestException('이메일을 입력해주세요.');
    }
    console.log('email in sverification',email)
    // 1. 인증번호 생성 (랜덤 6자리 숫자)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. 인증코드와 이메일을 임시 저장 (캐시 또는 DB에 저장)
    const verificationKey = `verification_${email}`;
    await this.cacheService.set(verificationKey, verificationCode, { ttl: 300 }); // 5분 유효 기간

    // 3. 이메일로 인증코드 전송
    await this.emailService.sendVerificationCode(email, verificationCode);

    return { verificationCode, message: '인증번호가 이메일로 전송되었습니다.' };
  }
}
