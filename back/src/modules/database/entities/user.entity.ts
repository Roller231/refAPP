import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Referral } from './referral.entity';
import { Transaction } from './transaction.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'telegram_id', type: 'bigint', unique: true })
  telegramId: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  username: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  balance: string;

  @Column({
    name: 'referral_code',
    type: 'varchar',
    length: 32,
    nullable: true,
    unique: true,
  })
  referralCode: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  region: string | null;
  

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Referral, (referral) => referral.inviter)
  referralsInvited: Referral[];

  @OneToMany(() => Referral, (referral) => referral.invited)
  referralsReceived: Referral[];

  @OneToMany(() => Transaction, (transaction) => transaction.fromUser)
  outgoingTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toUser)
  incomingTransactions: Transaction[];
}
