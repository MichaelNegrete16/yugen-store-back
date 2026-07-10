import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import {
  NewTransaction,
  TransactionRepository,
} from '../../domain/repository/transaction.repository';
import { CustomerModel } from '../models/customer.model';
import { DeliveryModel } from '../models/delivery.model';
import { TransactionItemModel } from '../models/transaction-item.model';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { TransactionModel } from '../models/transaction.model';

@Injectable()
export class TransactionService
  implements TransactionRepository
{
  constructor(
    @InjectRepository(TransactionModel)
    private readonly transactions: Repository<TransactionModel>,
    @InjectRepository(CustomerModel)
    private readonly customers: Repository<CustomerModel>,
  ) {}

  async create(data: NewTransaction): Promise<Transaction> {
    const customer = await this.resolveCustomer(data);

    const delivery = new DeliveryModel();
    Object.assign(delivery, data.delivery);

    const entity = this.transactions.create({
      reference: data.reference,
      status: data.status,
      amountCop: data.amountCop,
      subtotalCop: data.breakdown.subtotal,
      shippingCop: data.breakdown.shipping,
      taxCop: data.breakdown.tax,
      discountCop: data.breakdown.discount,
      currency: data.currency,
      cardBrand: data.cardBrand,
      cardLast4: data.cardLast4,
      gatewayTransactionId: data.gatewayTransactionId ?? null,
      customer,
      delivery,
      items: data.items.map((item) => {
        const orm = new TransactionItemModel();
        orm.productId = item.productId;
        orm.name = item.name;
        orm.unitPriceCop = item.unitPriceCop;
        orm.qty = item.qty;
        return orm;
      }),
    });

    const saved = await this.transactions.save(entity);
    return TransactionMapper.toDomain(saved);
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const entity = await this.transactions.findOne({ where: { reference } });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findByCustomerEmail(email: string): Promise<Transaction[]> {
    const entities = await this.transactions.find({
      where: { customer: { email } },
      order: { createdAt: 'DESC' },
    });
    return entities.map(TransactionMapper.toDomain);
  }

  async updateStatus(
    reference: string,
    status: TransactionStatus,
    gatewayTransactionId?: string | null,
  ): Promise<void> {
    await this.transactions.update(
      { reference },
      {
        status,
        ...(gatewayTransactionId !== undefined ? { gatewayTransactionId } : {}),
      },
    );
  }

  private async resolveCustomer(
    data: NewTransaction,
  ): Promise<CustomerModel> {
    const existing = await this.customers.findOne({
      where: { email: data.customer.email },
    });
    if (existing) {
      existing.fullName = data.customer.fullName;
      existing.phone = data.customer.phone ?? null;
      return this.customers.save(existing);
    }

    const customer = this.customers.create({
      email: data.customer.email,
      fullName: data.customer.fullName,
      phone: data.customer.phone ?? null,
    });
    return this.customers.save(customer);
  }
}
