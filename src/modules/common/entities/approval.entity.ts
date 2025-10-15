import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Step } from '../../services/entities/step.entity';

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  responsable_user_id: number;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @Column({ type: 'boolean' })
  approved: boolean;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ nullable: true })
  step_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'responsable_user_id' })
  responsableUser: User;

  @ManyToOne(() => Step, (step) => step.approval)
  @JoinColumn({ name: 'step_id' })
  step: Step;
}
