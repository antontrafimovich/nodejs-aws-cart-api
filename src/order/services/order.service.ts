import { Injectable } from '@nestjs/common';
import format from 'pg-format';
import { v4 } from 'uuid';

import { DbService } from '../../db';
import { Order, OrderRemote } from '../models';
import { mapModelToRemote, mapRemoteToModel } from './order.data-mapper';

@Injectable()
export class OrderService {
  constructor(private dbService: DbService) {}

  async findById(orderId: string): Promise<Order> {
    const data = await this.dbService.query<OrderRemote>(
      'select * from orders where user_id = $1',
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

    await this.dbService.query<OrderRemote>(
      format(
        `insert into orders (%I) values (%L)`,
        Object.keys(remoteOrder),
        Object.values(remoteOrder),
      ),
    );

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

    const columns = Object.keys(updatedOrderRemote);
    const values = Object.values(updatedOrderRemote);

    const sets = columns.map((column, index) => {
      return `${column} = $${index + 1}`;
    });

    const query = format(`UPDATE %I SET %s`, 'orders', sets.join(', '));

    await this.dbService.query<OrderRemote>(query, values);

    return updatedOrderRemote;
  }
}
