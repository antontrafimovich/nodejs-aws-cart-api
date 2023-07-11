import { Injectable } from '@nestjs/common';
import format from 'pg-format';
import { v4 } from 'uuid';

import { DbService } from '../../db';
import { Order, OrderRemote } from '../models';
import { mapModelToRemote, mapRemoteToModel } from './order.data-mapper';

type a = keyof OrderRemote;

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {};

  constructor(private dbService: DbService) {}

  async findById(orderId: string): Promise<Order> {
    const data = await this.dbService.query<OrderRemote>(
      'select * from cart where user_id = $1',
      [orderId],
    );

    return mapRemoteToModel(data.rows[0]);
  }

  async create(data: any) {
    const id = v4();

    const order = {
      ...data,
      id,
      status: 'OPEN',
    };

    const remoteOrder = mapModelToRemote(order);

    const result = await this.dbService.query<OrderRemote>(
      format(
        `insert into cart (${Object.keys(remoteOrder).toString()} %L)`,
        Object.values(remoteOrder),
      ),
    );

    console.log(result);

    return order;
  }

  async update(orderId, data) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    const updatedOrderRemote = mapModelToRemote({
      ...data,
      id: orderId,
    });

    const result = await this.dbService.query<OrderRemote>(
      format(
        `insert into cart (${Object.keys(updatedOrderRemote).toString()} %L)`,
        Object.values(updatedOrderRemote),
      ),
    );

    console.log(result);

    return updatedOrderRemote;
  }
}
