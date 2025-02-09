import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
  UploadedFile, HttpException, HttpStatus, UseGuards, Param,
} from '@nestjs/common';
import { EmailService } from './mail.service'; // 이메일 전송을 담당하는 서비스
import { CacheService } from './cache.service'; // 인증번호 저장을 담당하는 서비스 (예: Redis)
import { UserService } from '../user/user.service';
import { FindPasswordDto } from 'src/user/user.dto';
import { GatheringService } from '../gathering/gathering.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactDto } from './mail.dto';
import {SessionAuthGuard} from "../auth/auth.guard";

@Controller('mail')
export class VerificationController {
  constructor(
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
    private readonly gatheringService: GatheringService,
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

    return { pwChangeSuccess: true };
  }

  @Post('verifyCode')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    if (!email || !code) {
      throw new BadRequestException('Email and code are required.');
    }

    const verificationKey = `verification_${email}`;
    const storedCode = await this.cacheService.get(verificationKey);

    if (!storedCode) {
      throw new BadRequestException('The verification code has expired.');
    }

    if (storedCode !== code) {
      throw new BadRequestException('The verification code does not match.');
    }

    // 인증 성공: 필요한 추가 작업 수행 (예: 계정 활성화)
    return { message: 'Email verification has been completed.' };
  }

  @Post('deleteEvent/:id') // 이벤트 ID를 URL 파라미터로 받음
  async sendDeleteEventEmail(
      @Param('id') eventId: number,
      @Body('message') message: string,
  ): Promise<{ message: string }> {
    try {
      // 이벤트 ID로 참가자 조회
      const participants = await this.gatheringService.getParticipantsByEventId(eventId);

      if (!participants || participants.length === 0) {
        throw new HttpException(
            'No participants found for this event.',
            HttpStatus.NOT_FOUND,
        );
      }

      // 참가자들에게 이메일 전송
      await Promise.all(
          participants.map((participant) =>
              this.emailService.sendEventDeletionEmail(
                  participant.email, // 참가자의 이메일
                  message, // 삭제 이유
              ),
          ),
      );

      return { message: 'Email notifications sent successfully!' };
    } catch (error) {
      console.error('Error sending email notifications:', error);
      throw new HttpException(
          'Failed to send email notifications. Please try again.',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


}
