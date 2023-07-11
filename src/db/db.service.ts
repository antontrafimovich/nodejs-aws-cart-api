import { Inject, Injectable } from '@nestjs/common';
import { Client, QueryResult } from 'pg';

@Injectable()
export class DbService {
  constructor(@Inject('PG_CLIENT') private client: Client) {}

  async query<T>(queryText: string, values?: any[]): Promise<QueryResult<T>> {
    return this.client.query(queryText, values);
  }
}
