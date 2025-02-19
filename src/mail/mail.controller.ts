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
import { UserService } from '../user/user.service';
import { FindPasswordDto } from 'src/user/user.dto';
import { GatheringService } from '../gathering/gathering.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactDto } from './mail.dto';
import { EmailVerification } from './emailVerification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Controller('mail')
export class VerificationController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly gatheringService: GatheringService,
    @InjectRepository(EmailVerification)
    private readonly emailRepo: Repository<EmailVerification>,
  ) {}

  @Post('sendVerification')
  async sendVerification(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Please enter your email.');
    }

    // Directly call the service method that handles everything
    return this.emailService.sendVerificationEmail(email);
  }


  @Post('findPassword')
  async findPassword(@Body() findPasswordDto: FindPasswordDto) {
    const { userId, email } = findPasswordDto;

    // 1. 아이디와 이메일로 사용자 조회
    const user = await this.userService.findByUsernameAndEmail(userId, email);
    if (!user) {
      throw new NotFoundException("There is no user matching the provided ID and email.");
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

    // Find the verification code in the database
    const verification = await this.emailRepo.findOne({ where: { email, code } });

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification code.');
    }


    // Delete verification record upon success
    await this.emailRepo.delete({ email });
    return { message: 'Email verification has been successfully completed.' };
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

      async function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      for (const participant of participants) {
        try {
          await this.emailService.sendEventDeletionEmail(participant.email, message);
          await delay(1000); // 1초(1000ms) 대기 후 다음 이메일 전송
        } catch (error) {
          console.error(`❌ fail (${participant.email}):`, error);
        }
      }



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
