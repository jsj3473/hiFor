import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    Param,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
    UseInterceptors,
    UploadedFiles
  } from '@nestjs/common';
  import { CreateEventDto, ApplyEventDto } from './gathering.dto';
  import { diskStorage } from 'multer';
  import { JwtAuthGuard } from '../auth/auth.guard';
  import { GatheringService } from './gathering.service';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { Express } from 'express';
  import { v4 as uuidv4 } from 'uuid';

  
  @Controller('gathering')
  export class GatheringController {
    constructor(private readonly gatheringService: GatheringService) {}

    @Get()
    async getAllEvents(): Promise<any> {
      return await this.gatheringService.getAllEvents();
    }
  
    @Post('create')
    @UseInterceptors(
      FilesInterceptor('eventImages', 5, {
        storage: diskStorage({
        destination: (req, file, callback) => {
          console.log('저장 경로: ./uploads'); // 디버깅용 로그 추가
          callback(null, './uploads');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const extension = file.originalname.split('.').pop();
          const filename = `${uniqueSuffix}.${extension}`;
          console.log('저장될 파일 이름:', filename); // 디버깅용 로그 추가
          callback(null, filename);
        },
      })
      }),
    )
    async createEvent(
      @UploadedFiles() eventImages: Array<Express.Multer.File>,
      @Body() body: any,) {
      try {
          const createEventDto: CreateEventDto = {
          eventName: body.eventName,
          eventLocation: body.eventLocation,
          eventType: body.eventType,
          eventDetails: body.eventDetails,
          selectionQuestion: body.selectionQuestion,
          hashtags: body.hashtags ? body.hashtags.split(',') : [],
          price: parseFloat(body.price),
          priceInfo: body.priceInfo,
          userId: body.userId,
        };
        // 이미지 파일들을 처리하거나 createEventDto와 함께 저장하는 로직 작성
        const eventData = {
          ...createEventDto,
          eventImages: eventImages.map(file => file.filename), // 예시: 파일 이름 저장
        };
        return this.gatheringService.createEvent(eventData);
      } catch (error) {
        throw new HttpException('이벤트 생성에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // @Patch('update/:eventId')
    // @UseGuards(JwtAuthGuard)
    // async updateEvent(@Param('eventId') eventId: string, @Body() updateEventDto: UpdateEventDto) {
    //   try {
    //     return await this.gatheringService.updateEvent(eventId, updateEventDto);
    //   } catch (error) {
    //     throw new HttpException('이벤트 수정에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    //   }
    // }
  
    @Post('apply')
    @UseGuards(JwtAuthGuard)
    async applyForEvent(@Body() applyEventDto: ApplyEventDto) {
      try {
        return await this.gatheringService.applyForEvent(applyEventDto);
      } catch (error) {
        throw new HttpException('이벤트 참가 신청에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // @Patch('participant-status/:eventId')
    // @UseGuards(JwtAuthGuard)
    // async updateParticipantStatus(
    //   @Param('eventId') eventId: string,
    //   @Body() participantStatusDto: ParticipantStatusDto
    // ) {
    //   try {
    //     return await this.gatheringService.updateParticipantStatus(eventId, participantStatusDto);
    //   } catch (error) {
    //     throw new HttpException('참여자 권한 부여에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    //   }
    // }
  }
  