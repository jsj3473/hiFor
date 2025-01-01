import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GatheringModule } from './gathering/gathering.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'auth-test.sqlite',
      autoLoadEntities: true, // for data source
      synchronize: true,
<<<<<<< HEAD
      logging: false,
=======
      logging: true,
>>>>>>> 44a0bdf (250101)
    }),
    UserModule,
    AuthModule,
    MailModule,
    GatheringModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    console.log('Loaded Entities:', this.dataSource.entityMetadatas.map((e) => e.name));
  }
}
