import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GatheringModule } from './gathering/gathering.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigService 사용 가능
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 환경에 따라 .env 파일 로드
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('DATABASE_NAME', 'default.sqlite'), // 환경 변수에서 DB 이름 가져옴
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // 환경 변수로 동기화 여부 설정
        logging: configService.get<boolean>('DB_LOGGING', false), // 환경 변수로 로깅 설정
      }),
    }),
    UserModule,
    AuthModule,
    MailModule,
    GatheringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    console.log('Loaded Entities:', this.dataSource.entityMetadatas.map((e) => e.name));
  }
}
