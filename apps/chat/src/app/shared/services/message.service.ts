import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message, Room } from '@shane-chat/models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private _http: HttpClient) {}

  public createMessage(message: string, roomId: string): Observable<Message> {
    return this._http
      .post<Room>('/api/message', { message, roomId })
      .pipe(map((room) => new Message(room)));
  }
}
