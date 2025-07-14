import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Game } from './Game';
import { User } from './User';
import { GameCommentReaction } from './GameCommentReaction';

@Entity('game_comments', { schema: 'app1' })
export class GameComment {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ name: 'game_id' })
    gameId!: number;

  @Column({ name: 'user_id' })
    userId!: number;

  @Column()
    content!: string;

  @Column({ default: 'active' })
    status!: string;

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt!: Date;

  @ManyToOne(() => Game, (game: Game) => game.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
    game!: Game;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user!: User;

  @OneToMany(() => GameCommentReaction, (reaction) => reaction.comment)
    reactions?: GameCommentReaction[];
}
