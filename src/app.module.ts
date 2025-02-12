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
      isGlobal: true,
      envFilePath: ['.env'], // 환경 변수 파일 로드
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // PostgreSQL로 변경
        url: configService.get<string>('DATABASE_URL'), // 환경 변수에서 URL 가져오기
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // 운영 환경에서는 false 추천
        logging: configService.get<boolean>('DB_LOGGING', false),
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
