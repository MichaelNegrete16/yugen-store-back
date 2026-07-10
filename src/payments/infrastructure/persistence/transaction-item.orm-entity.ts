import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionOrmEntity } from './transaction.orm-entity';

@Entity({ name: 'transaction_items' })
export class TransactionItemOrmEntity {
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

  @ManyToOne(() => TransactionOrmEntity, (transaction) => transaction.items, {
    onDelete: 'CASCADE',
  })
  transaction: TransactionOrmEntity;
}
