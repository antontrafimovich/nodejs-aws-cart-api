import { Injectable } from '@nestjs/common';
import axios from 'axios';
import format from 'pg-format';
import { v4 } from 'uuid';

import { DbService } from '../../db';
import { Cart } from '../models';

type CartItemRemote = {
  cart_id: string;
  product_id: string;
  count: number;
};

type ProductRemote = {
  description: string;
  id: string;
  price: number;
  title: string;
  count: number;
};

@Injectable()
export class CartService {
  constructor(private dbService: DbService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const data = await this.dbService.query<Cart>(
      'select * from cart where user_id = $1',
      [userId],
    );

    const cart = data.rows[0];

    if (!cart) {
      return null;
    }

    const itemsResult = await this.dbService.query<CartItemRemote>(
      'select * from cart_item where cart_id = $1',
      [cart.id],
    );
    const cartItems = itemsResult.rows;

    const prodcutsResult = await axios<ProductRemote[]>(
      'https://i9m60vpkm1.execute-api.us-east-1.amazonaws.com/products',
      { method: 'GET' },
    );
    const prodcutsJson = prodcutsResult.data;

    return {
      id: cart.id,
      items: cartItems.map((item) => {
        const product = prodcutsJson.find(
          (product) => product.id === item.product_id,
        );
        return {
          count: item.count,
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
          },
        };
      }),
    };
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

    const deleteQuery = format('delete from cart_item where cart_id=%L', id);

    const insertQuery = format(
      'insert into cart_item (cart_id, product_id, count) values %L',
      values,
    );

    const result = await this.dbService.query<Cart>(
      `begin; ${deleteQuery}; ${insertQuery}; commit;`,
    );

    return { ...updatedCart };
  }

  public async checkout(userId: string) {
    await this.dbService.query(
      'update cart set status = $1 where user_id = $2',
      ['ORDERED', userId],
    );
  }

  async removeByUserId(userId): Promise<void> {
    await this.dbService.query<Cart>('delete from cart where user_id = $1', [
      userId,
    ]);
  }
}
