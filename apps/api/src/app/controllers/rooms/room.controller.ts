import { Body, Controller, Get, Param, Post, Req, Res, Sse } from '@nestjs/common';
import { Room } from '@shane-chat/models';
import { interval, map, Observable } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { RoomService } from './room.service';

@Controller()
export class RoomController {
  constructor(private _roomService: RoomService, private _messageService: MessageService) {}

  @Get('room')
  public async getRoomList(): Promise<Room[]> {
    return await this._roomService.listRooms();
  }

  @Get('room/:id')
  public async getRoomById(@Param('id') id: string): Promise<Room | undefined> {
    const room = await this._roomService.loadRoomById(id);
    if (!room) {
      return room;
    }

    room.messages = await this._messageService.loadMessagesByRoomId(room.id);
    return room;
  }

  @Post('room')
  public async createRoom(
    @Body('name') name: string,
    @Req() request: Request,
    @Res() response
  ): Promise<Room> {
    const id = request.headers['userid'];
    if (!id) {
      return response.status(401).send('Unauthorized');
    }

    const [error, room] = await this._roomService.createRoom(name, id);
    if (error) {
      return response
        .status(400)
        .send(
          error.indexOf('duplicate') > -1
            ? 'A room with this name already exists.'
            : error
        );
    }

    return response.status(201).send(room);
  }

  @Sse('sse')
  public sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => new MessageEvent('message', { data: { hello: 'world' } }))
    );
  }
}
