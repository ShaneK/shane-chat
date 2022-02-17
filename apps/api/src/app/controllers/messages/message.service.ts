import { Injectable } from '@nestjs/common';
import { Message, User } from '@shane-chat/models';
import { DataService } from '../../shared/services';

@Injectable()
export class MessageService {
  constructor(private _dataService: DataService) {}

  public async loadMessagesByRoomId(roomId: string): Promise<Message[]> {
    // Select top 50 messages for room ordered by date
    const { rows = [] } = await this._dataService.pool.query<Message>(
      `
SELECT *, users.name as author_name FROM public.messages messages
inner join public.users users on users.id = messages.user_id
WHERE room_id = $1 ORDER BY messages.created_on ASC FETCH FIRST 50 ROWS ONLY
`,
      [roomId]
    );

    return rows.map((x) => new Message(x));
  }

  public async createMessage(
    roomId: string,
    message: string,
    creatorId: string
  ): Promise<[string | undefined, Message | undefined]> {
    if (!creatorId) {
      return ['User ID is required.', undefined];
    }

    try {
      const { rows = [] } = await this._dataService.pool.query<Message>(
        'INSERT INTO public.messages (id, message, created_on, edited_on, user_id, room_id) VALUES (gen_random_uuid(), $1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $2, $3) RETURNING *',
        [message, creatorId, roomId]
      );

      return [undefined, new Message(rows[0])];
    } catch (error) {
      return [error.message, undefined];
    }
  }
}
