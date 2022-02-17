export class Message {
  public id: string = '';
  public message: string = '';
  public created_on: Date = new Date();
  public edited_on: Date = new Date();
  public author_name: string = '';
  public user_id: string = '';
  public room_id: string = '';
  public active: boolean = true;

  constructor(message: Partial<Message>) {
    Object.assign(this, message);
    this.created_on = message.created_on
      ? new Date(message.created_on)
      : this.created_on;
    this.edited_on = message.edited_on
      ? new Date(message.edited_on)
      : this.edited_on;
  }
}
