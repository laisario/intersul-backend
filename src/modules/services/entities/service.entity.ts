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
import { Client } from '../../clients/entities/client.entity';
import { ClientCopyMachine } from '../../copy-machines/entities/client-copy-machine.entity';
import { Category } from './category.entity';
import { Step } from './step.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  client_copy_machine_id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Client, (client) => client.services)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Category, (category) => category.services)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => ClientCopyMachine, (clientCopyMachine) => clientCopyMachine.services, { nullable: true })
  @JoinColumn({ name: 'client_copy_machine_id' })
  clientCopyMachine: ClientCopyMachine;

  @OneToMany(() => Step, (step) => step.service_id)
  steps: Step[];
}
