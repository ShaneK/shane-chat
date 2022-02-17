import { Injectable } from '@nestjs/common';
import { Room, User } from '@shane-chat/models';
import { DataService } from '../../shared/services';

@Injectable()
export class RoomService {
  constructor(private _dataService: DataService) {}

  public async listRooms(): Promise<Room[]> {
    const { rows = [] } = await this._dataService.pool.query<User>(
      'SELECT * from public.rooms'
    );

    return rows.map((row) => new Room(row));
  }

  public async loadRoomById(id: string): Promise<Room | undefined> {
    const { rows = [] } = await this._dataService.pool.query<User>(
      'SELECT * from public.rooms where id = $1',
      [id]
    );

    return rows.length ? new Room(rows[0]) : undefined;
  }

  public async createRoom(
    name: string,
    creatorId: string
  ): Promise<[string | undefined, Room | undefined]> {
    if (!creatorId) {
      return ['User ID is required.', undefined];
    }

    try {
      const { rows = [] } = await this._dataService.pool.query<User>(
        'INSERT INTO public.rooms (id, name, created_on, created_by) VALUES (gen_random_uuid(), $1, CURRENT_TIMESTAMP, $2) RETURNING *',
        [name, creatorId]
      );

      return [undefined, new Room(rows[0])];
    } catch (error) {
      return [error.message, undefined];
    }
  }
}
