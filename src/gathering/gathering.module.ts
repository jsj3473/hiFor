import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatheringController } from './gathering.controller';
import { GatheringService } from './gathering.service';
import { Participant,Hashtag,Event } from './gathering.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Participant, Hashtag])],
  controllers: [GatheringController],
  providers: [GatheringService],
})
export class GatheringModule {}
 