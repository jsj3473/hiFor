import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatheringController } from './gathering.controller';
import { GatheringService } from './gathering.service';
import { EmailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { Participant, Image, HiforEvent, Like, AdEmail } from './gathering.entity';
import { User } from '../user/user.entity';
import { EmailVerification } from '../mail/emailVerification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HiforEvent, Participant, Image, Like, User, AdEmail, EmailVerification]),
    forwardRef(() => MailModule),
  ],
  controllers: [GatheringController],
  providers: [GatheringService, EmailService],
  exports: [
    GatheringService,
    TypeOrmModule, // 📌 추가: 다른 모듈에서도 사용할 수 있도록 내보내기
  ],
})
export class GatheringModule {}
