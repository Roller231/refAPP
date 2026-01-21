import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'referrals' })
@Index('uq_referrals_invited', ['invited'], { unique: true })
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.referralsInvited, { nullable: false })
  @JoinColumn({ name: 'inviter_id' })
  inviter: User;

  @ManyToOne(() => User, (user) => user.referralsReceived, { nullable: false })
  @JoinColumn({ name: 'invited_id' })
  invited: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
