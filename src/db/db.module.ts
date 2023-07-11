import { Module } from '@nestjs/common';

import { DbService } from './db.service';
import { Client } from 'pg';

@Module({
  imports: [],
  providers: [
    {
      provide: 'PG_CLIENT',
      useFactory: async () => {
        const client = new Client();
        await client.connect();
        return client;
        },
    },
    DbService,
  ],
  exports: [DbService],
})
export class DbModule {}
