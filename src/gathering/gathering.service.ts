import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { HiforEvent, Image, Like, Participant } from './gathering.entity';
import { User } from '../user/user.entity';
import { CreateEventDto, SearchEventDto } from './gathering.dto';

@Injectable()
export class GatheringService {
  constructor(
    @InjectRepository(HiforEvent)
    private eventRepository: Repository<HiforEvent>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private readonly dataSource: DataSource,
  ) {}
  async createEvent(createEventDto: CreateEventDto): Promise<HiforEvent> {
    // 트랜잭션 생성
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      // 1. 사용자 검증
      const user = await this.userRepository.findOneBy({
        userId: createEventDto.userId,
      });
      if (!user) {
        throw new Error('User not found');
      }

      // 2. 이벤트 엔터티 생성 및 저장
      const { images, ...eventData } = createEventDto; // DTO에서 이미지와 기타 데이터를 분리
      const event = this.eventRepository.create({
        ...eventData,
        createdBy: user, // 생성자 정보 연결
      });

      // 이벤트를 먼저 저장
      const savedEvent = await queryRunner.manager.save(HiforEvent, event);

      // 3. 이미지 엔터티 생성 및 저장
      if (images && images.length > 0) {
        const imageEntities = images.map((url) =>
          this.imageRepository.create({
            url,
            event: savedEvent, // 저장된 이벤트와 연결
          }),
        );
        await queryRunner.manager.save(Image, imageEntities);
      }

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      return savedEvent;
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 트랜잭션 종료
      await queryRunner.release();
    }
  }

  async getAllEvents() {
    try {
      const events = await this.eventRepository.find({
        relations: ['participants', 'likes'], // 관계를 로드
        order: { createdAt: 'DESC' }, // 최신순 정렬
      });

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

          const approvedParticipantsCount =
            await this.participantRepository.count({
              where: {
                event: { id: event.id },
                status: 'Approved',
              },
            });
          return {
            id: event.id,
            name: event.name,
            description: event.description,
            mainImage: event.mainImage,
            location: event.location,
            date: event.date,
            type: event.type,
            category: event.category,
            price: event.price,
            maxParticipants: event.maxParticipants,
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
          };
        }),
      );

      // null 값을 제거하고 결과 반환
      return eventsWithApprovedCount.filter((event) => event !== null);
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  async getHot8Events() {
    try {
      const now = new Date();

      const events = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.participants', 'participants')
        .leftJoinAndSelect('event.likes', 'likes')
        .addSelect('COUNT(likes.id)', 'likeCount')
        .groupBy('event.id')
        .orderBy('likeCount', 'DESC')
        .where('event.date >= :now', { now: now.toISOString() }) // 과거 이벤트 제외
        .limit(8)
        .getMany();

      // 승인된 참가자 수 계산 추가 (필요 시)
      return await Promise.all(
        events.map(async (event) => {
          const approvedParticipantsCount =
            await this.participantRepository.count({
              where: {
                event: { id: event.id },
                status: 'Approved',
              },
            });
          return {
            id: event.id,
            name: event.name,
            description: event.description,
            mainImage: event.mainImage,
            location: event.location,
            date: event.date,
            type: event.type,
            category: event.category,
            price: event.price,
            maxParticipants: event.maxParticipants,
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
          };
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch hot events: ${error.message}`);
    }
  }

  async getEventById(eventId: number): Promise<HiforEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: [
        'createdBy',
        'images',
        'participants',
        'participants.user',
        'likes',
        'likes.user',
      ],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // participants가 로드되지 않았거나 undefined인 경우 안전하게 처리
    event.participants =
      event.participants?.filter(
        (participant) => participant.status === 'Approved',
      ) || [];

    return event;
  }
  async getEventByIdForPending(eventId: number): Promise<HiforEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: [
        'createdBy',
        'images',
        'participants',
        'participants.user',
        'likes',
        'likes.user',
      ],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // participants가 로드되지 않았거나 undefined인 경우 안전하게 처리
    event.participants =
      event.participants?.filter(
        (participant) => participant.status !== 'Rejected',
      ) || [];

    return event;
  }
  async getSortedEvents(sortBy: string) {
    const events = await this.eventRepository.find({
      relations: ['participants', 'likes'], // 필요한 관계 모두 가져오기
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
      events.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }

    // 데이터 매핑
    return await Promise.all(
      events.map(async (event) => {
        // Approved 참가자 수 계산
        const approvedParticipantsCount =
          await this.participantRepository.count({
            where: {
              event: { id: event.id },
              status: 'Approved',
            },
          });
        return {
          id: event.id,
          name: event.name,
          description: event.description,
          mainImage: event.mainImage,
          location: event.location,
          date: event.date,
          type: event.type,
          category: event.category,
          price: event.price,
          maxParticipants: event.maxParticipants,
          participants: approvedParticipantsCount, // 승인된 참가자 수
          likes: event.likes.length,
        };
      }),
    );
  }
  async getEventsByHostId(hostId: string) {
    try {
      const events = await this.eventRepository.find({
        where: {
          createdBy: { userId: hostId },
        },
        relations: ['images', 'participants', 'likes'],
      });

      return await Promise.all(
        events.map(async (event) => {
          const approvedParticipantsCount =
            await this.participantRepository.count({
              where: {
                event: { id: event.id },
                status: 'Approved',
              },
            });
          return {
            id: event.id,
            name: event.name,
            description: event.description,
            mainImage: event.mainImage,
            location: event.location,
            date: event.date,
            type: event.type,
            category: event.category,
            price: event.price,
            maxParticipants: event.maxParticipants,
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
          };
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch events by hostId: ${error.message}`);
    }
  }

  // like
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
      console.log('liked event:', events);
      return events;
    } catch (error) {
      throw new Error(`Failed to fetch liked events: ${error.message}`);
    }
  }
  async searchEventByCategory(_category: string) {
    try {
      if (_category === 'ALL') {
        return await this.getAllEvents();
      }
      return await this.eventRepository.find({
        where: { category: _category },
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch events for category "${_category}": ${error.message}`,
      );
    }
  }

  async searchEvent(searchEventDto: SearchEventDto) {
    const { query, date, location, type } = searchEventDto;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.createdBy', 'createdBy')
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
        const approvedParticipantsCount =
          await this.participantRepository.count({
            where: {
              event: { id: event.id },
              status: 'Approved',
            },
          });

        return {
          id: event.id,
          name: event.name,
          description: event.description,
          mainImage: event.mainImage,
          location: event.location,
          date: event.date,
          type: event.type,
          category: event.category,
          price: event.price,
          maxParticipants: event.maxParticipants,
          createdBy: {
            name: event.createdBy?.username,
            //profileImage: event.createdBy?.profileImage,
          },
          participants: approvedParticipantsCount, // 승인된 참가자 수
          likes: event.likes.length,
        };
      }),
    );

    // 디버깅: 검색된 이벤트와 매핑된 결과 확인
    console.log(`Mapped Events:`, mappedEvents);

    return mappedEvents;
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

    const user = await this.userRepository.findOne({
      where: { userId: _userId },
    });
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

  //participant
  async createParticipant(
    eventId: number,
    _userId: string,
    answer: string,
  ): Promise<Participant> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new Error('Event not found');
    }

    console.log(_userId)
    const user = await this.userRepository.findOne({
      where: { userId: _userId },
    });
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
  async getParticipatedEvent(participatedId: string) {
    try {
      const participants = await this.participantRepository.find({
        where: {
          user: { userId: participatedId }, // 특정 userId가 참여한 이벤트
          status: 'Approved', // 승인된 상태만 필터링
        },
        relations: ['event'], // 이벤트 정보 로드
      });

      // 참여한 이벤트 반환
      return participants.map((participant) => participant.event);
    } catch (error) {
      throw new Error(`Failed to fetch participated events: ${error.message}`);
    }
  }
  // 사용자 참여 여부 확인
  async checkParticipation(eventId: number, _userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { userId: _userId },
    });
    const participation = await this.participantRepository.findOne({
      where: { event: { id: eventId }, user: { id: user.id } },
    });
    return !!participation; // 값이 존재하면 true, 없으면 false
  }
  async updateStatus(
    participantId: number,
    status: string,
  ): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
    });

    if (!participant) {
      throw new NotFoundException(
        `Participant with ID ${participantId} not found`,
      );
    }

    participant.status = status; // 상태 변경
    return await this.participantRepository.save(participant); // 변경 사항 저장
  }
  async getApprovedParticipantsCount(eventId: number): Promise<number> {
    return await this.participantRepository.count({
      where: {
        event: { id: eventId },
        status: 'Approved',
      },
    });
  }

  async cancelParticipation(_userId: string, eventId: number): Promise<void> {
    // 이벤트 찾기
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['participants','participants.user'],
    });

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    // 사용자 찾기
    const user = await this.userRepository.findOne({ where: { userId: _userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 참여자 목록에서 사용자 제거
    event.participants = event.participants.filter(
      (participant) => participant.user.userId !== _userId
    );

    // 데이터베이스 업데이트
    await this.eventRepository.save(event);
  }
}
