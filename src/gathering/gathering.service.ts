import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event,Participant,Hashtag } from './gathering.entity';
import { CreateEventDto, ApplyEventDto } from './gathering.dto';

@Injectable()
export class GatheringService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    try {
      console.log('servicecalled:',createEventDto)
      const { hashtags, ...eventData } = createEventDto;
      const event = this.eventRepository.create(eventData);

      // 해시태그 처리
      if (hashtags && hashtags.length > 0) {
        const hashtagEntities = await Promise.all(
          hashtags.map(async (tag) => {
            if (tag.trim() === '') return null;
            let hashtag = await this.hashtagRepository.findOne({ where: { name: tag } });
            if (!hashtag) {
              hashtag = this.hashtagRepository.create({ name: tag });
              await this.hashtagRepository.save(hashtag);
            }
            return hashtag;
          })
        );
        event.hashtags = hashtagEntities;
      } 
      console.log(event)
      return await this.eventRepository.save(event);
    } catch (error) {
      console.error()
      throw new HttpException('이벤트 생성에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<Event> {
  //   try {
  //     await this.eventRepository.update(eventId, updateEventDto);
  //     const updatedEvent = await this.eventRepository.findOne(eventId);
  //     if (!updatedEvent) {
  //       throw new HttpException('이벤트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  //     }
  //     return updatedEvent;
  //   } catch (error) {
  //     throw new HttpException('이벤트 수정에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async applyForEvent(applyEventDto: ApplyEventDto): Promise<Participant> {
    try {
      const participant = this.participantRepository.create(applyEventDto);
      return await this.participantRepository.save(participant);
    } catch (error) {
      throw new HttpException('이벤트 참가 신청에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllEvents(): Promise<any> {
    return await this.eventRepository.find();
  }

  // async updateParticipantStatus(eventId: string, participantStatusDto: ParticipantStatusDto): Promise<Participant> {
  //   try {
  //     const { userId, status } = participantStatusDto;
  //     const participant = await this.participantRepository.findOne({ where: { eventId, userId } });
  //     if (!participant) {
  //       throw new HttpException('참여자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  //     }
  //     participant.status = status;
  //     return await this.participantRepository.save(participant);
  //   } catch (error) {
  //     throw new HttpException('참여자 권한 부여에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
