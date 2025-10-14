import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StepStatus } from '../../../common/enums/step-status.enum';
import { ServiceType } from '../../../common/enums/service-type.enum';
import { Service } from './service.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('service_steps')
export class ServiceStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service_id: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  service_type: ServiceType;

  @Column({ type: 'int' })
  order: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: StepStatus,
    default: StepStatus.PENDING,
  })
  status: StepStatus;

  @Column({ nullable: true })
  responsible_employee_id: number;

  @Column({ type: 'timestamp', nullable: true })
  completed_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Service, (service) => service.steps)
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => User, (user) => user.assignedSteps)
  @JoinColumn({ name: 'responsible_employee_id' })
  responsibleEmployee: User;
}
