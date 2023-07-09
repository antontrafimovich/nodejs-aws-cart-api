import { Injectable } from '@nestjs/common';
import { Client, QueryResult } from 'pg';

@Injectable()
export class DbService {
  private client = new Client();
  private connectPromise = this.client.connect();

  async query<T>(queryText: string, values?: any[]): Promise<QueryResult<T>> {
    await this.connectPromise;

    return this.client.query(queryText, values);
  }
}
