import { Injectable, HttpException, HttpStatus,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HiforEvent,Participant,Hashtag,Like } from './gathering.entity';
import { User } from '../user/user.entity';
import { CreateEventDto, ApplyEventDto } from './gathering.dto';

@Injectable()
export class GatheringService {
  constructor(
    @InjectRepository(HiforEvent)
    private eventRepository: Repository<HiforEvent>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<HiforEvent> {
    const { hashtags, ...eventData } = createEventDto;
    const user = await this.userRepository.findOneBy({ userId: createEventDto.userId });
    if (!user) {
      throw new Error('User not found');
    }
    // 1. 해시태그 변환: string[] -> Hashtag[]
    const hashtagEntities = [];
    if (hashtags && hashtags.length > 0) {
      for (const name of hashtags) {
        let hashtag = await this.hashtagRepository.findOne({ where: { name } });
        if (!hashtag) {
          // 해시태그가 없으면 새로 생성
          hashtag = this.hashtagRepository.create({ name });
          await this.hashtagRepository.save(hashtag);
        }
        hashtagEntities.push(hashtag);
      }
    }
    // 2. 이벤트 생성
    const event = this.eventRepository.create({
      ...eventData,
      hashtags: hashtagEntities, // 변환된 해시태그 배열
      createdBy: user,
    });
  
    return await this.eventRepository.save(event);
  }
  
  async saveEvent(createEventDto: CreateEventDto): Promise<HiforEvent> {
    // 해시태그 처리
    const hashtags = await Promise.all(
      createEventDto.hashtags.map(async (tagName) => {
        // 해시태그가 이미 존재하는지 확인
        let hashtag = await this.hashtagRepository.findOne({ where: { name: tagName } });
        if (!hashtag) {
          // 존재하지 않으면 새로운 해시태그 생성
          hashtag = this.hashtagRepository.create({ name: tagName });
          await this.hashtagRepository.save(hashtag);
        }
        return hashtag;
      })
    );
  
    // 이벤트 생성
    const event = this.eventRepository.create({
      ...createEventDto,
      hashtags, // 변환된 Hashtag[]를 이벤트에 연결
    });
  
    // 이벤트 저장
    return await this.eventRepository.save(event);
  }
  async getAllEvents() {
    try {
      const events = await this.eventRepository.find({
        relations: ['createdBy', 'hashtags', 'participants', 'likes'], // 관계를 로드
      });
  
      // 각 이벤트에 대해 승인된 참가자 수 계산
      const eventsWithApprovedCount = await Promise.all(
        events.map(async (event) => {
          const approvedParticipantsCount = await this.participantRepository.count({
            where: {
              event: { id: event.id },
              status: 'Approved',
            },
          });
  
          return {
            id: event.id,
            name: event.name,
            description: event.description,
            image: event.image,
            location: event.location,
            date: event.date,
            time: event.time,
            type: event.type,
            price: event.price,
            maxParticipants: event.maxParticipants,
            minParticipants: event.minParticipants,
            isDraft: event.isDraft,
            publishedAt: event.publishedAt,
            createdBy: {
              name: event.createdBy?.username,
              //profileImage: event.createdBy?.profileImage,
            },
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            hashtags: event.hashtags.map(hashtag => hashtag.name),
          };
        })
      );
  
      return eventsWithApprovedCount;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }
  
  async getEventById(eventId: number): Promise<HiforEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['createdBy', 'hashtags', 'participants', 'likes','likes.user'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }
  async toggleLike(eventId: number, _userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['likes', 'likes.user'], // 'likes.user'를 가져와야 함  
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    //console.log("변경전:",event.likes)
  
    const user = await this.userRepository.findOne({ where: { userId: _userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // 좋아요 여부 확인
    const userIndex = event.likes.findIndex((like) => like.user.id === user.id);
    //console.log("idx:",userIndex)
    if (userIndex > -1) {
      // 좋아요 제거
      const likeToRemove = event.likes[userIndex];
      await this.likeRepository.remove(likeToRemove); // Like 엔터티 제거
      event.likes.splice(userIndex, 1);
    } else {
      // 좋아요 추가
      const newLike = this.likeRepository.create({ user, event });
      await this.likeRepository.save(newLike); // Like 엔터티 저장
      event.likes.push(newLike);
    }
  
    // 변경된 좋아요 데이터 저장
    await this.eventRepository.save(event);
    
    console.log("변경후:",event.likes)
    return event.likes.length;
  }
  async createParticipant(eventId: number, _userId: string, answer: string): Promise<Participant> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new Error('Event not found');
    }

    const user = await this.userRepository.findOne({ where: { userId: _userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const participant = this.participantRepository.create({
      event,
      user,
      status: 'Pending',
      answer,
    });

    return await this.participantRepository.save(participant);
  }

  async getApprovedParticipantsCount(eventId: number): Promise<number> {
    return await this.participantRepository.count({
      where: {
        event: { id: eventId },
        status: 'Approved',
      },
    });
  }
}
