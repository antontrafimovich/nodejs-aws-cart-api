import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';
import { DbService } from '../../db';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async findOne(userId: string): Promise<Omit<User, 'password'>> {
    const userRemote = await this.dbService.query<User>(
      'select * from cart where user_id = $1',
      [userId],
    );

    const user = userRemote.rows[0];

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async createOne({ name, password }: User): Promise<Omit<User, 'password'>> {
    const id = v4();
    const newUser = { id: name || id, name, password };

    const userRemote = await this.dbService.query<User>(
      'insert into users (id, name, email, password) values ($1, $2, $3, $4)',
      [newUser.id, newUser.name, null, newUser.password],
    );

    return {
      id: newUser.id,
      name: newUser.name,
    };
  }
}
