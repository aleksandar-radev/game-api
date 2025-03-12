import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { GameComment } from './GameComment';

@Entity('games', { schema: 'app1' })
export class Game {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Index('IDX_GAMES_NAME')
  name!: string;

  @Column()
  title!: string;

  @Column()
  type!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl?: string;

  @Column({ name: 'big_logo_url', nullable: true })
  bigLogoUrl?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ name: 'publisher_id', nullable: true })
  publisherId?: number;

  @Column({ name: 'release_date', type: 'timestamp', nullable: true })
  releaseDate?: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating?: number;

  @Column({ default: 'active' })
  status!: string;

  @Column({ nullable: true })
  version?: string;

  @Column({ name: 'is_featured', default: false })
  isFeatured!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'publisher_id' })
  publisher?: User;

  @OneToMany(() => GameComment, (comment) => comment.game)
  comments?: GameComment[];

  constructor(config: Partial<Game>) {
    Object.assign(this, config);
  }
}
