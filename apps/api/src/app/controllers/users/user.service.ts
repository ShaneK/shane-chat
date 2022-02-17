import { Injectable } from '@nestjs/common';
import { User } from '@shane-chat/models';
import { DataService } from '../../shared/services';

@Injectable()
export class UserService {
  constructor(private _dataService: DataService) {}

  public async getUserDataById(id: string): Promise<User | undefined> {
    const { rows = [] } = await this._dataService.pool.query<User>(
      'SELECT * from public.users where id = $1',
      [id]
    );

    return rows.length ? new User(rows[0]) : undefined;
  }

  public async getUserDataByName(name: string): Promise<User | undefined> {
    const { rows = [] } = await this._dataService.pool.query<User>(
      'SELECT * from public.users where name = $1',
      [name]
    );

    return rows.length ? new User(rows[0]) : undefined;
  }

  public async createUserByName(
    name: string
  ): Promise<[string | undefined, User | undefined]> {
    const client = await this._dataService.pool.connect();
    try {
      const { rows = [] } = await client.query<User>(
        'INSERT INTO public.users (id, name, created_on, last_login) VALUES (gen_random_uuid(), $1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *;',
        [name]
      );

      return [undefined, rows.length ? new User(rows[0]) : undefined];
    } catch (e) {
      client.release();
      return [e.message, undefined];
    }
  }
}
