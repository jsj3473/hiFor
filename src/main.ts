import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8080',  // 프론트엔드 주소
    credentials: true,                // 쿠키를 사용하려면 true로 설정
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(
    session({
      secret: 'very-important-secret', // 세션 암호화에 사용되는 키
      resave: false, // 세션을 항상 저장할 지 여부
      saveUninitialized: false, // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
      cookie: { maxAge: 3600000 }, // 쿠키 유효기간 1시간
    }),
  );
  app.use(passport.initialize());
  await app.listen(3000);
}
bootstrap();
