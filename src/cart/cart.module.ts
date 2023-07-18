import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { DbModule } from '../db';

@Module({
  imports: [OrderModule, DbModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
