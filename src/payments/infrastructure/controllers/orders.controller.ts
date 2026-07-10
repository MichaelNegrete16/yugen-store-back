import { Controller, Get, Query } from '@nestjs/common';
import { ListOrdersUseCase } from '../../application/list-orders.usecase';
import { ListOrdersQueryDto } from '../dtos/list-orders.query.dto';
import { OrderPresenter, OrderResponse } from '../presenters/order.presenter';

@Controller('orders')
export class OrdersController {
  constructor(private readonly listOrders: ListOrdersUseCase) {}

  @Get()
  async findAll(
    @Query() query: ListOrdersQueryDto,
  ): Promise<OrderResponse[]> {
    const orders = await this.listOrders.execute(query.email);
    return OrderPresenter.toList(orders);
  }
}
