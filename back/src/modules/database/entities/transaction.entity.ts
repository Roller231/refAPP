import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TransactionType {
  ReferralReward = 'REFERRAL_REWARD',
  Transfer = 'TRANSFER',
  Admin = 'ADMIN',
}

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.outgoingTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User | null;

  @ManyToOne(() => User, (user) => user.incomingTransactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({
    name: 'idempotency_key',
    type: 'varchar',
    length: 64,
    nullable: true,
    unique: true,
  })
  idempotencyKey: string | null;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
