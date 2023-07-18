import { Module } from '@nestjs/common';

import { DbModule } from '../db';
import { OrderService } from './services';

@Module({
  imports: [DbModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
