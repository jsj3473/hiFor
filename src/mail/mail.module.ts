import { Module } from '@nestjs/common';
import { VerificationController } from './mail.controller';
import { EmailService } from './mail.service';
import { CacheService } from './cache.service';

@Module({
  controllers: [VerificationController],
  providers: [EmailService, CacheService],
})
export class MailModule {}
