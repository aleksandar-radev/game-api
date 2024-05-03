import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  constructor(config: Partial<User>) {
    Object.assign(this, config);
  }
}
