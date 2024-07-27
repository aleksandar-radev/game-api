import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { User } from './User';

@Entity('user_data')
@Index('IDX_USER_DATA_USER_ID_PREMIUM', ['user.id', 'premium'], {
  unique: true,
})
export class UserData {
  public static readonly PREMIUM_NO = 'no';
  public static readonly PREMIUM_YES = 'yes';
  public static readonly PREMIUM_TEST = 'test';

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_USER_DATA_USER_ID',
  })
  user!: User;

  @Column({ type: 'jsonb', nullable: true })
  data_json?: Object;

  @Column({ nullable: true })
  highest_level?: number;

  @Column({ nullable: true })
  total_experience?: number;

  @Column({ nullable: true })
  total_gold?: number;

  @Column({ default: UserData.PREMIUM_NO })
  premium!: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;

  constructor(config: Partial<UserData>) {
    Object.assign(this, config);
  }
}
