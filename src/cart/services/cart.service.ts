import { Injectable } from '@nestjs/common';
import format from 'pg-format';
import { v4 } from 'uuid';

import { DbService } from '../../db';
import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(private dbService: DbService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const data = await this.dbService.query<Cart>(
      'select * from cart where user_id = $1',
      [userId],
    );

    return data.rows[0];
  }

  async createByUserId(userId: string) {
    const id = v4();

    const date = new Date().toISOString();

    let result;

    try {
      result = await this.dbService.query<Cart>(
        'insert into cart (id, user_id, created_at, updated_at, status) values ($1, $2, $3, $4, $5)',
        [id, userId, date, date, 'OPEN'],
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    const values = items.map(({ product, count }) => [id, product.id, count]);

    const result = format(
      'insert into cart_item (cart_id, product_id, count) values %L',
      values,
    );

    await this.dbService.query<Cart>(
      `begin; delete from cart_item where cart_id = $1; ${result}; commit;`,
      [id],
    );

    return { ...updatedCart };
  }

  async removeByUserId(userId): Promise<void> {
    await this.dbService.query<Cart>('delete from cart where user_id = $1', [
      userId,
    ]);
  }
}
