import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { DbModule } from '../db';

@Module({
  imports: [DbModule],
  providers: [ UsersService ],
  exports: [ UsersService ],
})
export class UsersModule {}
