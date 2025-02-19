import {
  Body,
  Controller, Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, Req,
  UploadedFile, UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateEventDto,
  CreateParticipantDto,
  SearchEventDto,
} from './gathering.dto';
import { GatheringService } from './gathering.service';
import { ConfigService } from '@nestjs/config';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as console from 'node:console';
import { extname } from 'path';
import supabase from '../supabase';

@Controller('gathering')
  export class GatheringController {
    constructor(    private readonly gatheringService: GatheringService,
                    private readonly configService: ConfigService, ) {}

  @Post('upload-image-postEvent')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: undefined, // Supabase 사용 시 Multer의 storage 필요 없음
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // 파일명 생성 (이벤트용 이미지라 event- 접두사 추가)
    const fileExt = extname(file.originalname);
    const fileName = `event-${Date.now()}${fileExt}`;

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
    if (error) {
      throw new HttpException('Failed to upload image', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Supabase에서 제공하는 퍼블릭 URL 생성
    const imageUrl = `https://vpivwjxuuobsmetklofb.supabase.co/storage/v1/object/public/event-images/${fileName}`;

    return {
      success: true,
      fileName: file.originalname,
      imageUrl,
    };
  }

  @Post('submit')
  //@UseGuards(SessionAuthGuard)
    async createEvent(@Body() createEventDto: CreateEventDto) {
      try {
        const event = await this.gatheringService.createEvent(createEventDto);
        return { success: true, event };
      } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
      }
    }

  @Get()
  async getEvents(
    @Query('fetchType') fetchType: string,
    @Query('category') category?: string,
    @Query(new ValidationPipe({ transform: true })) searchEventDto?: SearchEventDto,
  ) {
    try {
      switch (fetchType) {
        case 'all':
          return await this.gatheringService.getAllEvents();
        case 'hot':
          return await this.gatheringService.getHotEvents();
        case 'search':
          return await this.gatheringService.searchEvent(searchEventDto);
        case 'category':
          return await this.gatheringService.searchEventByCategory(category);
        case 'upcoming':
          return await this.gatheringService.getUpcomingEvents();
        default:
          throw new Error('Invalid type parameter');
      }
    } catch (error) {
      throw new Error(`Failed to get events: ${error.message}`);
    }
  }



  @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads', // 파일 저장 경로
          filename: (req, file, callback) => {
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
            callback(null, uniqueName); // 파일명을 유니크하게 설정
          },
        }),
      }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      const baseUrl = this.configService.get<string>('BASE_URL'); // 환경 변수에서 BASE_URL 가져오기
      console.log(baseUrl)
      const fileUrl = `${baseUrl}/uploads/${file.filename}`; // 저장된 파일의 URL 생성
        return {
          success: true,
          url: fileUrl, // 클라이언트에 반환할 URL
        };
    }
    @Get('getEvents/:eventId')
    async getEvent(@Param('eventId') eventId: number) {
      const event = await this.gatheringService.getEventById(eventId);
      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }
      return event;
    }
    @Get('getEventForPending/:eventId')
    async getEventByIdForPending(@Param('eventId') eventId: number) {
      const event = await this.gatheringService.getEventByIdForPending(eventId);
      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }
      return event;
    }
    @Post(':eventId/like')
    //@UseGuards(SessionAuthGuard)
    async toggleLike(@Param('eventId', ParseIntPipe) eventId: number, @Body('userId') userId: string) {
      const updatedLikes = await this.gatheringService.toggleLike(eventId, userId);
      return { likesLen: updatedLikes };
    }

    // 좋아요 상태 확인
    @Get(':eventId/isLiked')
    async isLiked(
      @Param('eventId') eventId: number,
      @Query('userId') userId: string,
    ): Promise<{ isLiked: boolean }> {
      const isLiked = await this.gatheringService.checkLikeStatus(eventId, userId);
      return { isLiked };
    }
    @Post('createParticipant')
    async createParticipant(@Body() createParticipantDto: CreateParticipantDto) {
      const { eventId, userId, answer } = createParticipantDto;
      return await this.gatheringService.createParticipant(eventId, userId, answer);
    }

    @Patch(':id/status')
    async updateParticipantStatus(
      @Param('id') participantId: number,
      @Body('status') status: string,
      @Body('eventId') eventId: number,
    ) {
      if (!['Approved', 'Rejected'].includes(status)) {
        throw new HttpException('Invalid status value', HttpStatus.BAD_REQUEST);
      }
  
      return await this.gatheringService.updateStatus(participantId, status, eventId);
    }

    @Get('getEventsByHostId/:userId')
    async getEventsByHostId(@Param('userId') hostId: string){
      return await this.gatheringService.getEventsByHostId(hostId)
    }

    @Get('getParticipatedEvent/:userId')
    async getParticipatedEvent(@Param('userId') participatedId: string) {
      return await this.gatheringService.getParticipatedEvent(participatedId);
    }    
    
    @Get('getLikedEvent/:userId')
    async getLikedEvent(@Param('userId') likedId: string) {
      return await this.gatheringService.getLikedEvents(likedId);
    }



    @Get('sorted')
    async getSortedEvents(@Query('sortBy') sortBy: string) {
      return await this.gatheringService.getSortedEvents(sortBy);
    }

    @Get('checkParticipation')
    async checkParticipation(
      @Query('eventId') eventId: number,
      @Query('userId') userId: string
    ): Promise<{ isParticipating: boolean }> {
      console.log(userId,eventId)
      const isParticipating = await this.gatheringService.checkParticipation(eventId, userId);
      return { isParticipating };
    }

    @Post('cancelParticipation')
    async cancelParticipation(
      @Body() cancelParticipationDto: { userId: string; eventId: number }
    ): Promise<{ message: string }> {
      const { userId, eventId } = cancelParticipationDto;

      if (!userId || !eventId) {
        throw new HttpException('Missing userId or eventId', HttpStatus.BAD_REQUEST);
      }

      await this.gatheringService.cancelParticipation(userId, eventId);
      return { message: 'Participation canceled successfully.' };
    }

    // 요청 본문에서 email 필드만 추출합니다.
    @Post('subscribe')
    async subscribe(@Body('email') email: string) {
      return await this.gatheringService.subscribe(email);
    }

    @Delete(':eventId')
    async deleteEvent(@Param('eventId') eventId: number) {
      const deleted = await this.gatheringService.deleteEvent(eventId);
      if (!deleted) {
        throw new HttpException('Event not found or failed to delete', HttpStatus.NOT_FOUND);
      }
      return { message: 'Event successfully deleted' };
    }
  }
  