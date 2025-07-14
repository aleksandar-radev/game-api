import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  Unique,
  DeleteDateColumn,
} from 'typeorm';
import { GameComment } from './GameComment';
import { User } from './User';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity('game_comment_reactions', { schema: 'app1' })
@Unique('UQ_user_comment_reaction', ['userId', 'commentId'])
export class GameCommentReaction {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ name: 'comment_id' })
  @Index()
    commentId!: number;

  @Column({ name: 'user_id' })
  @Index()
    userId!: number;

  @Column({
    name: 'reaction_type',
    type: 'varchar',
    enum: ReactionType,
  })
  @Index()
    reactionType!: ReactionType;

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt!: Date;

  @ManyToOne(() => GameComment, (comment) => comment.reactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
    comment!: GameComment;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
    user!: User;

  constructor(config: Partial<GameCommentReaction>) {
    Object.assign(this, config);
  }
}
