import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Patch,
    Param,
    UseGuards,
    Request,
    HttpException,
    HttpStatus,
    UseInterceptors,
    UploadedFile,
    NotFoundException
  } from '@nestjs/common';
  import { CreateEventDto, ApplyEventDto } from './gathering.dto';
  import { JwtAuthGuard } from '../auth/auth.guard';
  import { GatheringService } from './gathering.service';

  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { v4 as uuidv4 } from 'uuid';
  import * as path from 'path';

  @Controller('gathering')
  export class GatheringController {
    constructor(private readonly gatheringService: GatheringService) {}

    @Post('submit')
    async submitEvent(@Body() createEventDto: CreateEventDto) {
      try {
        console.log('CreateEventDto in cont:', createEventDto);
        const event = await this.gatheringService.createEvent(createEventDto);
        return { success: true, event };
      } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
      }
    }
    
    @Post('save')
    async saveEvent(@Body() createEventDto: CreateEventDto) {
      try {
        const event = await this.gatheringService.saveEvent(createEventDto);
        return { success: true, event };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
    @Get()
    async getAllEvents() {
      try {
        const events = await this.gatheringService.getAllEvents();
        
        //console.log(events)
        return events;
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
      const fileUrl = `http://localhost:3000/uploads/${file.filename}`; // 저장된 파일의 URL 생성
      return {
        success: true,
        url: fileUrl, // 클라이언트에 반환할 URL
      };
    }
    @Get('events/:eventId')
    async getEvent(@Param('eventId') eventId: number) {
      console.log(eventId)
      const event = await this.gatheringService.getEventById(eventId);
      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }
      return event;
    }
  }
  