import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,OneToMany } from 'typeorm';
import { User } from '../user/user.entity'; 
@Entity('hifor_event')
export class HiforEvent {
  @PrimaryGeneratedColumn()
  id: number; // 이벤트 고유 식별자

  @Column({ length: 80, nullable: true })
  name: string; // 이벤트 이름

  @Column({ type: 'text', nullable: true })
  description: string; // 이벤트 설명 (선택)

  @Column({ type: 'text', nullable: true })
  question: string

  @Column({ length: 30, nullable: true })
  location: string; // 이벤트 장소 (구 단위)

  @Column({ length: 255, nullable: true })
  locationDetail: string; // 이벤트 장소 (세부)

  @Column({ type: 'date', nullable: true })
  date: string; // 이벤트 날짜 (선택)

  @Column({ type: 'time', nullable: true })
  time: string; // 이벤트 시간 (선택)

  @Column({ length: 20, nullable: true })
  type: string; // 이벤트 유형 (예: First come, Register)

  @Column({ length: 30, nullable: true })
  category: string; // 이벤트 카테고리

  @Column({ nullable: true })
  mainImage: string; // 이벤트 카테고리

  @Column({ type: 'int', nullable: true })
  price: number; // 이벤트 가격 (선택, 기본값 없음)

  @Column({ type: 'int', nullable: true })
  maxParticipants: number; // 최대 참가 인원 (선택)

  @Column({ type: 'int', nullable: true })
  minParticipants: number; // 최소 참가 인원 (선택)

  @CreateDateColumn()
  createdAt: Date; // 생성 시간

  @UpdateDateColumn()
  updatedAt: Date; // 업데이트 시간

  @ManyToOne(() => User, (user) => user.events, { eager: false })
  createdBy: User; // 이벤트 생성자 (User 엔터티와 관계)

  @OneToMany(() => Image, (image) => image.event, { cascade: true })
  images: Image[];

  @OneToMany(() => Participant, (participant) => participant.event)
  participants: Participant[]; // 이벤트에 연결된 참가자 목록

  @OneToMany(() => Like, (like) => like.event)
  likes: Like[]; // 이벤트와 연결된 좋아요 목록

}

@Entity('participant')
export class Participant {
  @PrimaryGeneratedColumn()
  id: number; // 참가자 고유 식별자

  @ManyToOne(() => HiforEvent, (event) => event.participants, { onDelete: 'CASCADE' })
  event: HiforEvent; // 참가자가 등록한 이벤트

  @ManyToOne(() => User, (user) => user.participations, { onDelete: 'CASCADE' })
  user: User; // 참가자 (사용자)

  @Column({ type: 'varchar', length: 20, default: 'Pending' })
  status: string; // 참가 상태 (예: Pending, Approved, Rejected)

  @Column({ type: 'text', nullable: true })
  answer: string; // 선택 질문에 대한 참가자의 답변

  @CreateDateColumn()
  createdAt: Date; // 참가 신청 시간

  @UpdateDateColumn()
  updatedAt: Date; // 참가 정보 업데이트 시간
}

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number; // 좋아요 고유 ID

  @ManyToOne(() => HiforEvent, (event) => event.likes, { onDelete: 'CASCADE' })
  event: HiforEvent; // 좋아요가 눌린 이벤트 (Many-to-One 관계)

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User; // 좋아요를 누른 사용자 (Many-to-One 관계)

  @CreateDateColumn()
  createdAt: Date; // 좋아요가 눌린 시간
}

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string; // 이미지 파일 URL

  @ManyToOne(() => HiforEvent, (event) => event.images)
  event: HiforEvent;
}