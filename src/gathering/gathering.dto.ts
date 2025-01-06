import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsUUID,
  IsPositive,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxParticipants?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  minParticipants?: number;

  @IsString()
  userId: string;

  @IsBoolean()
  isDraft: boolean; // 임시 저장 여부
}


export class ApplyEventDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: number;

  @IsOptional()
  @IsString()
  answer?: string;
}

export class CreateParticipantDto {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsNotEmpty()
  userId: string;

  @IsString()
  answer: string;
}

export class SearchEventDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  type?: string;
}