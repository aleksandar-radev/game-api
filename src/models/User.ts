import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { UserData } from "./UserData";

@Entity("users")
@Index("IDX_USER_USERNAME", ["username"], {
  unique: true,
})
@Index("IDX_USER_EMAIL", ["email"], {
  unique: true,
})
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "timestamp", default: () => "now()" })
  created_at!: Date;

  @Column({ type: "timestamp", default: () => "now()" })
  updated_at!: Date;

  @OneToMany(() => UserData, (userData) => userData.user)
  userData?: UserData[];

  constructor(config: Partial<User>) {
    Object.assign(this, config);
  }
}
