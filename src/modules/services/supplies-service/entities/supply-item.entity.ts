import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supply } from '../../../supplies/entities/supply.entity';

@Entity('supply_items')
export class SupplyItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplies_service_id: number;

  @Column()
  supply_id: number;

  @Column({ type: 'int' })
  quantity_requested: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Supply, (supply) => supply.supplyItems)
  @JoinColumn({ name: 'supply_id' })
  supply: Supply;
}
