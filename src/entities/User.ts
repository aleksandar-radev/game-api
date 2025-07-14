import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { GameData } from './GameData';

@Entity('users')
@Index('IDX_USER_USERNAME', ['username'], {
  unique: true,
})
@Index('IDX_USER_EMAIL', ['email'], {
  unique: true,
})
export class User {
  public static readonly ROLE_ADMIN = 'admin';
  public static readonly ROLE_USER = 'user';
  public static readonly ROLE_TESTER = 'tester';
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ nullable: true })
    username?: string;

  @Column()
    password!: string;

  @Column()
    email!: string;

  @Column({ default: User.ROLE_USER })
    role!: string;

  @CreateDateColumn()
    created_at!: Date;

  @UpdateDateColumn()
    updated_at!: Date;

  @UpdateDateColumn()
    last_active!: Date;

  @OneToMany(() => GameData, (gameData) => gameData.user)
    gameData?: GameData[];

  constructor(config: Partial<User>) {
    Object.assign(this, config);
  }
}
