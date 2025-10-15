import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClientCopyMachine } from './client-copy-machine.entity';

@Entity('copy_machine_catalog')
export class CopyMachineCatalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  features: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ClientCopyMachine, (clientCopyMachine) => clientCopyMachine.catalogCopyMachine)
  clientCopyMachines: ClientCopyMachine[];
}
