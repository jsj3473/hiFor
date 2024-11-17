import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateEventDto {
  @IsString()
  eventName: string;

  @IsString()
  eventLocation: string;

  @IsString()
  eventType: string;

  @IsString()
  eventDetails: string;

  @IsOptional()
  @IsString()
  selectionQuestion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  priceInfo?: string;

  @IsString()
  userId: string;
  
  @IsArray()
  @IsString({ each: true }) // 배열의 각 요소가 문자열이어야 함
  eventImages?: string[]; // 파일 이름 저장
}

export class ApplyEventDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsOptional()
  @IsString()
  answer?: string;
}
