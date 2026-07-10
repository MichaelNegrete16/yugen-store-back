import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListOrdersUseCase } from '../../application/list-orders.usecase';
import { OrderResponseDoc } from '../docs/order.response';
import { ListOrdersQueryDto } from '../dtos/list-orders.query.dto';
import { OrderPresenter, OrderResponse } from '../presenters/order.presenter';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly listOrders: ListOrdersUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Historial de compras por email (más reciente primero)' })
  @ApiQuery({ name: 'email', example: 'kenji@example.com' })
  @ApiOkResponse({ type: OrderResponseDoc, isArray: true })
  async findAll(@Query() query: ListOrdersQueryDto): Promise<OrderResponse[]> {
    const orders = await this.listOrders.execute(query.email);
    return OrderPresenter.toList(orders);
  }
}
