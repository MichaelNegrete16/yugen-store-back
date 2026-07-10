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
import { TransactionStatus } from '../../domain/entities/transaction.entity';
import { CustomerModel } from './customer.model';
import { DeliveryModel } from './delivery.model';
import { TransactionItemModel } from './transaction-item.model';

@Entity({ name: 'transactions' })
export class TransactionModel {
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

  @ManyToOne(() => CustomerModel, { eager: true, cascade: true })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerModel;

  @ManyToOne(() => DeliveryModel, { eager: true, cascade: true })
  @JoinColumn({ name: 'deliveryId' })
  delivery: DeliveryModel;

  @OneToMany(() => TransactionItemModel, (item) => item.transaction, {
    eager: true,
    cascade: true,
  })
  items: TransactionItemModel[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
