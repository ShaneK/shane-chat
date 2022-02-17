import { Injectable } from '@nestjs/common';
import { DataService } from './data.service';

/**
 * The migration service is injected into in main.ts during setup.
 * It does a quick check to see if the `users` table exists, if not it runs
 * a simple migration script to set up the necessary tables.
 */
@Injectable()
export class MigrationService {
  constructor(private _dataService: DataService) {}

  public async migrate(): Promise<void> {
    const client = await this._dataService.pool.connect();
    const { rows = [] } = await client.query<{ exists: boolean }>(`
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE  table_schema = 'public'
  AND    table_name   = 'users'
);
`);

    const hasMigrated = rows[0]?.exists ?? false;
    if (hasMigrated) {
      console.log('Already  migrated, skipping migration routine.');
      await client.release();
      return;
    }

    console.log('Migrating database...');
    await client.query(`
CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  name VARCHAR ( 50 ) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE rooms (
  id uuid PRIMARY KEY,
  name VARCHAR ( 50 ) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL,
  created_by uuid NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT fk_user
    FOREIGN KEY(created_by)
      REFERENCES users(id)
);

CREATE TABLE messages (
  id uuid PRIMARY KEY,
  message VARCHAR ( 2000 ) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL,
  edited_on TIMESTAMP NOT NULL,
  user_id uuid NOT NULL,
  room_id uuid NOT NULL,
  active boolean NOT NULL DEFAULT true,

  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(id),

  CONSTRAINT fk_room
    FOREIGN KEY(room_id)
      REFERENCES rooms(id)
);
    `);

    client.release();
    console.log('Successfully completed migration.');
  }
}
