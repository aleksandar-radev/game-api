import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('feedback', { schema: 'app1' })
export class Feedback {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column({ nullable: true })
    name?: string;

  @Column({ nullable: true })
    email?: string;

  @Column({ type: 'text', nullable: true })
    message?: string;

  @Column({ default: 'pending' })
    status!: string;

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date;

  constructor(config: Partial<Feedback>) {
    Object.assign(this, config);
  }
}
