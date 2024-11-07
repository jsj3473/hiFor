// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  userId: string;

  @Column({ default: false })
  isVerified: boolean;  // 이메일 인증 상태

  @Column({ nullable: true })
  verificationToken: string;  // 이메일 인증 토큰

  @Column({ type: 'datetime', nullable: true })
  tokenExpiration: Date;  // 이메일 인증 토큰 만료 시간

  @Column({ nullable: true})
  phoneNumber: string;  // 휴대폰 번호

  @Column({ default: false })
  isPhoneVerified: boolean;  // 휴대폰 인증 상태

  @Column({ nullable: true })
  phoneVerificationCode: string;  // 휴대폰 인증 코드

  @Column({ type: 'datetime', nullable: true })
  phoneVerificationExpiration: Date;  // 휴대폰 인증 코드 만료 시간

  @Column({ type: 'datetime', nullable: true })
  emailVerificationExpiration: Date;  // 이메일 인증 링크 만료 시간

  @Column({ nullable: true })
  nationality: string;  // 국적

  @Column({ nullable: true })
  identityStatus: string;  // 신분 (예: 학생, 직장인 등)

  @Column({ type: 'date', nullable: true })
  dob: Date;  // 생년월일

  @Column({ nullable: true })
  gender: string;  // 성별 (예: 남성, 여성, 기타)
  
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  passwordLastChanged: Date;

  @Column({ default: false })
  passwordReset: boolean;
}
