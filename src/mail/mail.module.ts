import { Module } from '@nestjs/common';
import { VerificationController } from './mail.controller';
import { EmailService } from './mail.service';
import { CacheService } from './cache.service';
import { UserModule } from '../user/user.module';
import { GatheringModule } from '../gathering/gathering.module';

@Module({
  imports: [
    UserModule,
    GatheringModule, // 📌 GatheringModule을 import하여 이벤트 데이터 사용 가능
  ],
  controllers: [VerificationController],
  providers: [EmailService, CacheService],
  exports: [EmailService],
})
export class MailModule {}
