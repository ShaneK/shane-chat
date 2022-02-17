import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '@shane-chat/models';
import { map, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private _http: HttpClient) {}

  public listRooms(): Observable<Room[]> {
    return this._http
      .get<Room[]>(`/api/room`)
      .pipe(map((rooms) => rooms.map((room) => new Room(room))));
  }

  public createRoom(name: string): Observable<Room> {
    return this._http
      .post<Room>('/api/room', { name })
      .pipe(map((room) => new Room(room)));
  }

  public loadRoomById(id: string): Observable<Room | undefined> {
    return this._http
      .get<Room | undefined>(`/api/room/${id}`)
      .pipe(map((room) => (room ? new Room(room) : undefined)));
  }
}
