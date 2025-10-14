import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';

@Entity('copy_machines')
export class CopyMachine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column({ unique: true })
  serial_number: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Service, (service) => service.copyMachine)
  services: Service[];
}
