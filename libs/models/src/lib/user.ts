export class User {
  public id: string = '';
  public name: string = '';
  public created_on: Date = new Date();
  public last_login: Date = new Date();
  public active: boolean = true;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
    this.created_on = init?.created_on ? new Date(init.created_on) : new Date();
    this.last_login = init?.last_login ? new Date(init.last_login) : new Date();
  }
}
