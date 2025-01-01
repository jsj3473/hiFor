import { Injectable, HttpException, HttpStatus,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
<<<<<<< HEAD
import { Repository } from 'typeorm';
import { HiforEvent,Participant,Hashtag,Like } from './gathering.entity';
import { User } from '../user/user.entity';
import { CreateEventDto, ApplyEventDto } from './gathering.dto';
=======
import { MoreThanOrEqual, Repository } from 'typeorm';
import { HiforEvent,Participant,Hashtag,Like } from './gathering.entity';
import { User } from '../user/user.entity';
import { CreateEventDto, ApplyEventDto, SearchEventDto } from './gathering.dto';
>>>>>>> 44a0bdf (250101)

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
<<<<<<< HEAD
  
      // 각 이벤트에 대해 승인된 참가자 수 계산
      const eventsWithApprovedCount = await Promise.all(
        events.map(async (event) => {
=======

      // 현재 날짜 및 시간 가져오기
      const now = new Date();

      // 각 이벤트에 대해 승인된 참가자 수 계산
      const eventsWithApprovedCount = await Promise.all(
        events.map(async (event) => {
          const eventDateTime = new Date(`${event.date}T${event.time}`);

          // 이벤트가 과거일 경우 제외
          if (eventDateTime < now) {
            return null;
          }

>>>>>>> 44a0bdf (250101)
          const approvedParticipantsCount = await this.participantRepository.count({
            where: {
              event: { id: event.id },
              status: 'Approved',
            },
          });
<<<<<<< HEAD
  
=======

>>>>>>> 44a0bdf (250101)
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
<<<<<<< HEAD
  
      return eventsWithApprovedCount;
=======

      // null 값을 제거하고 결과 반환
      return eventsWithApprovedCount.filter(event => event !== null);
>>>>>>> 44a0bdf (250101)
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }
<<<<<<< HEAD
=======

>>>>>>> 44a0bdf (250101)
  
  async getEventById(eventId: number): Promise<HiforEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
<<<<<<< HEAD
      relations: ['createdBy', 'hashtags', 'participants','participants.user', 'likes','likes.user'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }
=======
      relations: ['createdBy', 'hashtags', 'participants', 'participants.user', 'likes', 'likes.user'],
    });
  
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  
    // participants가 로드되지 않았거나 undefined인 경우 안전하게 처리
    event.participants = event.participants?.filter(
      (participant) => participant.status === 'Approved'
    ) || [];

  
    return event;
  }
  async getEventByIdForPending(eventId: number): Promise<HiforEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['createdBy', 'hashtags', 'participants', 'participants.user', 'likes', 'likes.user'],
    });
  
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }
  
    // participants가 로드되지 않았거나 undefined인 경우 안전하게 처리
    event.participants = event.participants?.filter(
      (participant) => participant.status !== 'Rejected'
    ) || [];

  
    return event;
  }
  
  
  

>>>>>>> 44a0bdf (250101)
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

  async updateStatus(participantId: number, status: string): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
    });
    

    if (!participant) {
      throw new NotFoundException(`Participant with ID ${participantId} not found`);
    }

    participant.status = status; // 상태 변경
    return await this.participantRepository.save(participant); // 변경 사항 저장
  }

  async getEventsByHostId(hostId: string) {
    try {
      const events = await this.eventRepository.find({
        where: {
          createdBy: { userId: hostId },
        },
        relations: ['createdBy', 'hashtags', 'participants', 'likes'],
      });
  
      return await Promise.all(
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
            },
            participants: approvedParticipantsCount,
            likes: event.likes.length,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            hashtags: event.hashtags.map((hashtag) => hashtag.name),
          };
        })
      );
    } catch (error) {
      throw new Error(`Failed to fetch events by hostId: ${error.message}`);
    }
  }
  
  async getParticipatedEvent( participatedId: string) {
    try {
      const participants = await this.participantRepository.find({
        where: {
          user: { userId: participatedId }, // 특정 userId가 참여한 이벤트
          status: 'Approved',  // 승인된 상태만 필터링
        },
        relations: ['event'],   // 이벤트 정보 로드
      });

      // 참여한 이벤트 반환
      const events = participants.map((participant) => participant.event);
      return events;
    } catch (error) {
      throw new Error(`Failed to fetch participated events: ${error.message}`);
    }
  }

  async getLikedEvents(likedId: string) {
    try {
      const likedEvents = await this.likeRepository.find({
        where: {
          user: { userId: likedId }, // 특정 userId가 좋아요를 누른 이벤트
        },
        relations: ['event'], // 이벤트 정보 로드
      });
  
      // 좋아요한 이벤트만 반환
      const events = likedEvents.map((like) => like.event);
      console.log('liked event:',events)
      return events;
    } catch (error) {
      throw new Error(`Failed to fetch liked events: ${error.message}`);
    }
  }
<<<<<<< HEAD
=======
  async searchEvent(searchEventDto: SearchEventDto) {
    const { query, date, location, type } = searchEventDto;
  
    const queryBuilder = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'createdBy')
      .leftJoinAndSelect('event.hashtags', 'hashtags')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.likes', 'likes');
  
    // 제목 검색 조건 추가
    if (query) {
      queryBuilder.andWhere('event.name LIKE :query', { query: `%${query}%` });
    }
  
    // 날짜 조건 추가
    if (date) {
      queryBuilder.andWhere('event.date = :date', { date });
    }
  
    // 위치 조건 추가
    if (location) {
      queryBuilder.andWhere('event.location = :location', { location });
    }
  
    // 모집 유형 조건 추가
    if (type) {
      queryBuilder.andWhere('event.type = :type', { type });
    }
  
    // 쿼리 실행
    const events = await queryBuilder.getMany();
  
    // 데이터 매핑
    const mappedEvents = await Promise.all(
      events.map(async (event) => {
        // Approved 참가자 수 계산
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
            name: event.createdBy?.username, // 작성자 이름만 반환
          },
          participants: approvedParticipantsCount, // 승인된 참가자 수 반환
          likes: event.likes.length, // 좋아요 수 반환
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          hashtags: event.hashtags.map((hashtag) => hashtag.name), // 해시태그 이름만 반환
        };
      })
    );
  
    // 디버깅: 검색된 이벤트와 매핑된 결과 확인
    console.log(`Mapped Events:`, mappedEvents);
  
    return mappedEvents;
  }
  
  async getSortedEvents(sortBy: string){
    const events = await this.eventRepository.find({
      relations: ['createdBy', 'hashtags', 'participants', 'likes'], // 필요한 관계 모두 가져오기
      where: {
        date: MoreThanOrEqual(new Date().toISOString().slice(0, 10)), // 현재 날짜를 YYYY-MM-DD 형식의 문자열로 변환
      },
    });
  
    // 정렬 로직
    if (sortBy === 'hot') {
      // 좋아요 수 기준 내림차순 정렬
      events.sort((a, b) => b.likes.length - a.likes.length);
    } else if (sortBy === 'date') {
      // 날짜 기준 오름차순 정렬
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  
    // 데이터 매핑
    const mappedEvents = await Promise.all(
      events.map(async (event) => {
        // Approved 참가자 수 계산
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
            name: event.createdBy?.username, // 작성자 이름만 반환
          },
          participants: approvedParticipantsCount, // 승인된 참가자 수 반환
          likes: event.likes.length, // 좋아요 수 반환
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          hashtags: event.hashtags.map((hashtag) => hashtag.name), // 해시태그 이름만 반환
        };
      })
    );
  
    return mappedEvents;
  }
  // 사용자 참여 여부 확인
  async checkParticipation(eventId: number, _userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { userId: _userId }, 
    })
    const participation = await this.participantRepository.findOne({
      where: { event: { id: eventId }, user: { id: user.id } },
    });
    return !!participation; // 값이 존재하면 true, 없으면 false
  }
  
>>>>>>> 44a0bdf (250101)
  
}
