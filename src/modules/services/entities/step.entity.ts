import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StepStatus } from '../../../common/enums/step-status.enum';
import { User } from '../../auth/entities/user.entity';
import { Category } from './category.entity';
import { Approval } from '../../common/entities/approval.entity';
import { Image } from '../../common/entities/image.entity';

@Entity('steps')
export class Step {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  observation: string;

  @Column({ type: 'timestamp', nullable: true })
  datetime_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  datetime_conclusion: Date;

  @Column({ type: 'timestamp', nullable: true })
  datetime_expiration: Date;

  @Column({
    type: 'enum',
    enum: StepStatus,
    default: StepStatus.PENDING,
  })
  status: StepStatus;

  @Column({ nullable: true })
  responsable_id: number;

  @Column({ nullable: true })
  responsable_client: string;

  @Column({ nullable: true })
  category_id: number;

  @Column({ nullable: true })
  service_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.assignedSteps)
  @JoinColumn({ name: 'responsable_id' })
  responsable: User;

  @ManyToOne(() => Category, (category) => category.steps, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;


  @OneToOne(() => Approval, (approval) => approval.step)
  approval: Approval;

  @OneToMany(() => Image, (image) => image.step)
  images: Image[];
}
