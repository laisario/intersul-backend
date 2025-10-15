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
import { AcquisitionType } from '../../../common/enums/acquisition-type.enum';
import { Client } from '../../clients/entities/client.entity';
import { CopyMachineCatalog } from './copy-machine-catalog.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('client_copy_machines')
export class ClientCopyMachine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  serial_number: string;

  @Column()
  client_id: number;

  @Column({ nullable: true })
  catalog_copy_machine_id: number;

  @Column({ nullable: true })
  external_model: string;

  @Column({ nullable: true })
  external_manufacturer: string;

  @Column({ type: 'text', nullable: true })
  external_description: string;

  @Column({
    type: 'enum',
    enum: AcquisitionType,
  })
  acquisition_type: AcquisitionType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.copyMachines)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => CopyMachineCatalog, (catalogCopyMachine) => catalogCopyMachine.clientCopyMachines, { nullable: true })
  @JoinColumn({ name: 'catalog_copy_machine_id' })
  catalogCopyMachine: CopyMachineCatalog;

  @OneToMany(() => Service, (service) => service.clientCopyMachine)
  services: Service[];
}
