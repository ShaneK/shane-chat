import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

/**
 * The data service is responsible for setting up pooling for our PostgreSQL connection
 */
@Injectable()
export class DataService {
  public readonly pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT, 10),
    });
  }
}
