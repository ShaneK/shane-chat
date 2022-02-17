import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Message, Room } from '@shane-chat/models';
import { RoomService } from '../rooms/room.service';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private _messageService: MessageService) {}

  @Post('message')
  public async postMessage(
    @Body('roomId') roomId: string,
    @Body('message') message: string,
    @Req() request: Request,
    @Res() response
  ): Promise<Room> {
    const id = request.headers['userid'];
    if (!id) {
      return response.status(401).send('Unauthorized');
    }

    const [error, room] = await this._messageService.createMessage(roomId, message, id);
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
}
