import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MaintenanceType } from '../../../../common/enums/maintenance-type.enum';
import { Service } from '../../entities/service.entity';

@Entity('maintenance')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  service_id: number;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column({ type: 'text', nullable: true })
  problem_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Service, (service) => service.maintenance)
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
