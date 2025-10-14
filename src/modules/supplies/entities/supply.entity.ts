import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SupplyCategory } from '../../../common/enums/supply-category.enum';
import { SupplyItem } from '../../services/supplies-service/entities/supply-item.entity';

@Entity('supplies')
export class Supply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  quantity_in_stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: SupplyCategory,
    default: SupplyCategory.PARTS,
  })
  category: SupplyCategory;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SupplyItem, (supplyItem) => supplyItem.supply)
  supplyItems: SupplyItem[];
}
