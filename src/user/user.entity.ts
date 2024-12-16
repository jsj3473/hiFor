// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { HiforEvent, Participant, Like } from '../gathering/gathering.entity'; // 사용자 엔터티가 있다고 가정
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true})
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  phoneNumber: string;  // 휴대폰 번호

  @Column({ nullable: true })
  nationality: string;  // 국적

  @Column({ type: 'date', nullable: true })
  dob: Date;  // 생년월일

  @Column({ nullable: true })
  gender: string;  // 성별 (예: 남성, 여성, 기타)  


  @Column({ nullable: true })
  university: string;
  
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  passwordLastChanged: Date;

  @Column({ default: false })
  passwordReset: boolean;

  @OneToMany(() => HiforEvent, (event) => event.createdBy)
  events: HiforEvent[]; // 사용자가 생성한 이벤트 목록
  
  @OneToMany(() => Participant, (participant) => participant.user)
  participations: Participant[]; // 사용자가 참가한 이벤트 목록

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[]; // 사용자가 좋아요를 누른 목록

  // @Column({ default: false })
  // isVerified: boolean;  // 이메일 인증 상태  안쓰는컬럼

  // @Column({ nullable: true })
  // verificationToken: string;  // 이메일 인증 토큰 안쓰는컬람

  // @Column({ type: 'datetime', nullable: true })
  // tokenExpiration: Date;  // 이메일 인증 토큰 만료 시간  안쓰는 컬럼 삭제예정

  // @Column({ nullable: true })
  // identityStatus: string;  // 신분 (예: 학생, 직장인 등) >>?

  // @Column({ default: false })
  // isPhoneVerified: boolean;  // 휴대폰 인증 상태  안씀

  // @Column({ nullable: true })
  // phoneVerificationCode: string;  // 휴대폰 인증 코드 안씀

  // @Column({ type: 'datetime', nullable: true })
  // phoneVerificationExpiration: Date;  // 휴대폰 인증 코드 만료 시간 안씀

  // @Column({ type: 'datetime', nullable: true })
  // emailVerificationExpiration: Date;  // 이메일 인증 링크 만료 시간  안쓰는컬럼
}
