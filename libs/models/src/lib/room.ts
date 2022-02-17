import { Message } from './message';

export class Room {
  public id: string = '';
  public name: string = '';
  public created_on: Date = new Date();
  public created_by: string = '';
  public active: boolean = true;
  public messages?: Message[] = [];

  constructor(room: Partial<Room>) {
    Object.assign(this, room);
    this.messages = room.messages
      ? room.messages.map((message) => new Message(message))
      : [];
    this.created_on = room.created_on
      ? new Date(room.created_on)
      : this.created_on;
  }
}
