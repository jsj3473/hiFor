import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import {AdEmail, HiforEvent, Image, Like, Participant} from './gathering.entity';
import { User } from '../user/user.entity';
import { CreateEventDto, SearchEventDto } from './gathering.dto';
import { EmailService } from '../mail/mail.service';

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
    @InjectRepository(AdEmail)
    private adEmailRepository: Repository<AdEmail>,
    private readonly dataSource: DataSource,
    private emailService: EmailService, // EmailService 주입
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

  async getUpcomingEvents() {
    try {
      const events = await this.eventRepository.find({
        relations: ['participants', 'likes'], // 관계를 로드
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
            time: event.time,
            type: event.type,
            category: event.category,
            price: event.price,
            maxParticipants: event.maxParticipants,
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
          };
        })
      );

      // null 값을 제거하고, date와 time을 기준으로 오름차순 정렬
      return eventsWithApprovedCount
        .filter((event) => event !== null)
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });

    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }


  async getHotEvents() {
    try {
      const now = new Date();


      const events = await this.eventRepository
        .createQueryBuilder('hifor_event') // 테이블 이름을 hifor_event로 지정
        .leftJoin('hifor_event.participants', 'participants') // 관계도 수정
        .leftJoin('hifor_event.likes', 'likes') // 좋아요 테이블과 조인
        .addSelect('COUNT(DISTINCT likes.id)', 'likeCount') // DISTINCT 추가하여 좋아요 개수 계산
        .groupBy('hifor_event.id') // 이벤트별 그룹화
        .orderBy('likeCount', 'DESC') // 좋아요 수 기준 내림차순 정렬
        .where('hifor_event.date >= :now', { now: now.toISOString() }) // 현재 날짜 이후 이벤트만 조회
        .getRawMany();


      // Raw 데이터 가공 (참가자 수 포함)
      const processedEvents = await Promise.all(
        events.map(async (event) => {
          try {

            // 참가자 수 계산
            const approvedParticipantsCount = await this.participantRepository.count({
              where: {
                event: { id: event.hifor_event_id }, // 관계 확인
                status: 'Approved',
              },
            });

            const formattedEvent = {
              id: event.hifor_event_id,
              name: event.hifor_event_name,
              description: event.hifor_event_description,
              mainImage: event.hifor_event_mainImage,
              location: event.hifor_event_location,
              date: event.hifor_event_date,
              type: event.hifor_event_type,
              category: event.hifor_event_category,
              price: event.hifor_event_price,
              maxParticipants: event.hifor_event_maxParticipants,
              participants: approvedParticipantsCount, // 승인된 참가자 수
              likes: parseInt(event.likeCount, 10), // 좋아요 수 변환
            };

            return formattedEvent;

          } catch (innerError) {
            console.error('❌ Error processing event:', event, innerError.message);
            return null; // 오류 발생 시 null 반환
          }
        }),
      );

      return processedEvents.filter(e => e !== null); // 오류 발생한 이벤트(null)는 제외하고 반환

    } catch (error) {
      console.error('❌ Failed to fetch hot events:', error.message);
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
        relations: ['createdBy','images', 'participants', 'likes'],
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
            createdBy: {
              username: event.createdBy?.username, // createdBy에서 username 가져옴
              userId: event.createdBy?.userId,     // createdBy에서 userId 가져옴
            },
          };
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch events by hostId: ${error.message}`);
    }
  }

// 좋아요한 이벤트 가져오기
  async getLikedEvents(likedId: string) {
    try {
      const likedEvents = await this.likeRepository.find({
        where: {
          user: { userId: likedId }, // 특정 userId가 좋아요를 누른 이벤트
        },
        relations: ['event', 'event.createdBy', 'event.likes', 'event.participants'], // 필요한 관계 로드
      });

      // 좋아요한 이벤트만 추출
      const events = likedEvents
        .map((like) => like.event)
        .filter((event) => event !== null);

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
              username: event.createdBy?.username,
              userId: event.createdBy?.userId,
              // profileImage: event.createdBy?.profileImage,
            },
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
          };
        }),
      );

      // 매핑된 좋아요 이벤트 반환
      return mappedEvents;
    } catch (error) {
      throw new Error(`Failed to fetch liked events: ${error.message}`);
    }
  }

  async searchEventByCategory(_category: string) {
    try {
      if (_category === 'All') {
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
            userId: event.createdBy?.userId,
            //profileImage: event.createdBy?.profileImage,
          },
          participants: approvedParticipantsCount, // 승인된 참가자 수
          likes: event.likes.length,
        };
      }),
    );

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
  // 좋아요 상태 확인
  async checkLikeStatus(eventId: number, _userId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { event: { id: eventId }, user: { userId: _userId } },
    });
    return !!like; // 좋아요 여부 반환
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
    const user = await this.userRepository.findOne({
      where: { userId: _userId },
      relations: ['createdBy'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    const status = event.type === 'Register' ? 'Pending' : 'Approved';

    const participant = this.participantRepository.create({
      event,
      user,
      status,
      answer,
    });

    await this.emailService.sendCreatePartiEmail(
      event.createdBy.email, // 메일 수신자는 호스트
      {
        hostName: event.createdBy.username,      // 호스트 이름
        eventTitle: event.name,                    // 이벤트 제목
        eventDate: event.date,                     // 이벤트 날짜
        eventLocation: event.location,             // 이벤트 장소
        participantName: user.username,            // 신청한 참가자의 이름
        eventId: event.id,
      }
    )

    return await this.participantRepository.save(participant);

  }
  async getParticipatedEvent(participatedId: string) {
    try {
      const participants = await this.participantRepository.find({
        where: {
          user: { userId: participatedId }, // 특정 userId가 참여한 이벤트
          status: 'Approved', // 승인된 상태만 필터링
        },
        relations: ['event', 'event.createdBy', 'event.likes', 'event.participants'], // 필요한 관계 로드
      });

      // null이 아닌 이벤트만 추출
      const events = participants
        .map((participant) => participant.event)
        .filter((event) => event !== null);

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
              username: event.createdBy?.username,
              userId: event.createdBy?.userId,
              // profileImage: event.createdBy?.profileImage,
            },
            participants: approvedParticipantsCount, // 승인된 참가자 수
            likes: event.likes.length,
          };
        }),
      );

      // 디버깅: 매핑된 결과 확인
      console.log(`Mapped Events:`, mappedEvents);

      // 매핑된 이벤트를 반환
      return mappedEvents;
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
    eventId: number,
  ): Promise<Participant> {
    // participant와 관련된 user 정보를 함께 조회
    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
      relations: ['user'],
    });
    const curEvent = await  this.eventRepository.findOne({
      where: { id: eventId}
    })
    if (!participant) {
      throw new NotFoundException(`Participant with ID ${participantId} not found`);
    }

    participant.status = status;
    const updatedParticipant = await this.participantRepository.save(participant);

    // 이메일 전송: 상태에 따라 각각 다른 템플릿 사용
    try {
      if (status === 'Approved') {
        await this.emailService.sendApprovedEmail(
          participant.user.email,
          {
            guestName: participant.user.username,
            eventTitle: curEvent.name,
            eventDate: curEvent.date,
            eventLocation: curEvent.location,
            eventId: curEvent.id,
          },
        );
      } else if (status === 'Rejected') {
        await this.emailService.sendRejectedEmail(
          participant.user.email,
          {
            guestName: participant.user.username,
            eventTitle: curEvent.name,
          },
        );
      }
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      // 이메일 전송 실패해도 업데이트 로직은 정상 처리하도록 함
    }

    return updatedParticipant;
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

  async subscribe(email: string) {
    // email 값만 받아서 엔티티 생성
    const adEmail = this.adEmailRepository.create({ email });
    return await this.adEmailRepository.save(adEmail);
  }
}
