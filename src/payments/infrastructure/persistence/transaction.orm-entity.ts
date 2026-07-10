import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../../domain/transaction';
import { CustomerOrmEntity } from './customer.orm-entity';
import { DeliveryOrmEntity } from './delivery.orm-entity';
import { TransactionItemOrmEntity } from './transaction-item.orm-entity';

@Entity({ name: 'transactions' })
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  reference: string;

  @Column({ type: 'varchar' })
  status: TransactionStatus;

  @Column({ type: 'int' })
  amountCop: number;

  @Column({ type: 'int' })
  subtotalCop: number;

  @Column({ type: 'int' })
  shippingCop: number;

  @Column({ type: 'int' })
  taxCop: number;

  @Column({ type: 'int' })
  discountCop: number;

  @Column({ type: 'varchar', default: 'COP' })
  currency: string;

  @Column({ type: 'varchar' })
  cardBrand: string;

  @Column({ type: 'varchar' })
  cardLast4: string;

  @Column({ type: 'varchar', nullable: true })
  gatewayTransactionId: string | null;

  @ManyToOne(() => CustomerOrmEntity, { eager: true, cascade: true })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerOrmEntity;

  @ManyToOne(() => DeliveryOrmEntity, { eager: true, cascade: true })
  @JoinColumn({ name: 'deliveryId' })
  delivery: DeliveryOrmEntity;

  @OneToMany(() => TransactionItemOrmEntity, (item) => item.transaction, {
    eager: true,
    cascade: true,
  })
  items: TransactionItemOrmEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
