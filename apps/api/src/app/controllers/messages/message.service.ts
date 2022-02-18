import { Injectable } from '@nestjs/common';
import { Message } from '@shane-chat/models';
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

      // Get the full row data, including the user name, to send to the front through SSE
      const { rows: fullRows = [] } =
        await this._dataService.pool.query<Message>(
          `
SELECT *, users.name as author_name FROM public.messages messages
inner join public.users users on users.id = messages.user_id
WHERE room_id = $1 and messages.id = $2 ORDER BY messages.created_on ASC
`,
          [roomId, rows[0].id]
        );
      if (fullRows.length) {
        // Give the row information to PostgreSQL as a notification, we listen for this in the room controller
        await this._dataService.subscriber.notify('room-message-added', fullRows[0]);
      }

      return [undefined, new Message(rows[0])];
    } catch (error) {
      return [error.message, undefined];
    }
  }
}
