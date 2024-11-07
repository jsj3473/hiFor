import { Module } from '@nestjs/common';
import { VerificationController } from './mail.controller';
import { EmailService } from './mail.service';
import { CacheService } from './cache.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule], 
  controllers: [VerificationController],
  providers: [EmailService, CacheService],
})
export class MailModule {}
