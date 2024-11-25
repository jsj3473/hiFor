import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatheringController } from './gathering.controller';
import { GatheringService } from './gathering.service';
import { Participant,Hashtag,HiforEvent,Like } from './gathering.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HiforEvent, Participant, Hashtag, Like, User])],
  controllers: [GatheringController],
  providers: [GatheringService],
})
export class GatheringModule {}
 