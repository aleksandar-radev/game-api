import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_data")
export class UserData {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "jsonb" })
  data_json?: object;

  @Column()
  highest_level?: number;

  @Column()
  total_experience?: number;

  @Column()
  total_gold?: number;

  @Column({ default: "no" })
  premium?: string;

  constructor(config: Partial<UserData>) {
    Object.assign(this, config);
  }
}
