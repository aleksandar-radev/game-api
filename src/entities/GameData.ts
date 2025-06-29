import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, Index, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Game } from './Game';
import { LeaderboardStats } from '../types/LeaderboardStats';

@Entity('game_data')
@Index('IDX_GAME_DATA_USER_ID_PREMIUM', ['user.id', 'premium'], {
  unique: true,
})
export class GameData {
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
    foreignKeyConstraintName: 'FK_GAME_DATA_USER_ID',
  })
    user!: User;

  @ManyToOne(() => Game, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({
    name: 'game_id',
    foreignKeyConstraintName: 'FK_GAME_DATA_GAME_ID',
  })
    game?: Game;

  @Column({ type: 'jsonb', nullable: true })
    data_json?: Object;

  @Column({ type: 'jsonb', nullable: true })
    leaderboard_stats?: LeaderboardStats;

  @Column({ default: GameData.PREMIUM_NO })
    premium!: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
    created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
    updated_at!: Date;

  constructor(config: Partial<GameData>) {
    Object.assign(this, config);
  }
}
