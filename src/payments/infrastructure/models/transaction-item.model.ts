import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionModel } from './transaction.model';

@Entity({ name: 'transaction_items' })
export class TransactionItemModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  productId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  unitPriceCop: number;

  @Column({ type: 'int' })
  qty: number;

  @ManyToOne(() => TransactionModel, (transaction) => transaction.items, {
    onDelete: 'CASCADE',
  })
  transaction: TransactionModel;
}
