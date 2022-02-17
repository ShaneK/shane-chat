import { formatRelative } from 'date-fns';
import { Message } from './message';

export class Room {
  public id: string = '';
  public name: string = '';
  public created_on: Date = new Date();
  public last_activity: Date = new Date();
  public creator_name: string = '';
  public created_by: string = '';
  public active: boolean = true;
  public messages?: Message[] = [];

  constructor(room: Partial<Room> & { last_message?: Date }) {
    Object.assign(this, room);
    this.messages = room.messages
      ? room.messages.map((message) => new Message(message))
      : [];
    this.created_on = room.created_on
      ? new Date(room.created_on)
      : this.created_on;
    this.last_activity = room.last_message
      ? new Date(room.last_message)
      : this.created_on;
  }

  public lastActivityMessage(): string {
    return formatRelative(this.last_activity, new Date());
  }
}
