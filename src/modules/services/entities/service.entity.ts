import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ServiceType } from '../../../common/enums/service-type.enum';
import { Client } from '../../clients/entities/client.entity';
import { CopyMachine } from '../../copy-machines/entities/copy-machine.entity';
import { ServiceStep } from './service-step.entity';
import { Maintenance } from '../maintenance/entities/maintenance.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ServiceType,
  })
  type: ServiceType;

  @Column()
  client_id: number;

  @Column()
  copy_machine_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.services)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => CopyMachine, (copyMachine) => copyMachine.services)
  @JoinColumn({ name: 'copy_machine_id' })
  copyMachine: CopyMachine;

  @OneToMany(() => ServiceStep, (step) => step.service)
  steps: ServiceStep[];

  @OneToMany(() => Maintenance, (maintenance) => maintenance.service)
  maintenance: Maintenance[];
}
