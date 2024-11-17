import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventName: string;

  @Column()
  eventLocation: string;

  @Column()
  eventType: string;

  @Column('text')
  eventDetails: string;

  @Column({ nullable: true })
  selectionQuestion: string;

  @Column('simple-array')
  eventImages: string[];

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  priceInfo: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Participant, participant => participant.event)
  participants: Participant[];

  @ManyToMany(() => Hashtag, hashtag => hashtag.events, { cascade: true })
  @JoinTable()
  hashtags: Hashtag[];
}

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  eventId: string;

  @Column('text', { nullable: true })
  answer: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  appliedAt: Date;

  @ManyToOne(() => Event, event => event.participants)
  event: Event;
}

@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Event, event => event.hashtags)
  events: Event[];
}
