import { Injectable, Injector } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { isNotNullOrUndefined } from '@shane-chat/helpers';
import { Room } from '@shane-chat/models';
import { filter } from 'rxjs';
import { RoomService } from '../../services/room.service';

export namespace RoomActions {
  export class ListRooms {
    public static type = '[RoomState] List rooms';
    constructor() {}
  }

  export class CreateRoom {
    public static type = '[RoomState] Create room';
    constructor(public name: string) {}
  }

  export class LoadRoomById {
    public static type = '[RoomState] Load room by ID';
    constructor(public id: string) {}
  }
}

export interface RoomStore {
  rooms: Room[];
}

@State<RoomStore>({
  name: 'rooms',
  defaults: {
    rooms: [],
  },
})
@Injectable()
export class RoomState {
  public static roomService: RoomService;

  constructor(private _injector: Injector) {
    RoomState.roomService = _injector.get(RoomService);
  }

  @Selector([RoomState])
  public static rooms({ rooms }: RoomStore): Room[] {
    return rooms;
  }

  public static roomById(
    id?: string
  ): ({ rooms }: { rooms: Room[] }) => Room | undefined {
    return createSelector(
      [RoomState],
      ({ rooms }: { rooms: Room[] }): Room | undefined => {
        if (id == null) {
          return undefined;
        }

        return rooms?.find((x) => x.id === id) || undefined;
      }
    );
  }

  @Action(RoomActions.ListRooms)
  public listRooms({ setState }: StateContext<RoomStore>): void {
    RoomState.roomService.listRooms().subscribe((rooms) => {
      setState((state) => {
        return {
          ...(state || {}),
          rooms: rooms.map((x) => new Room(x)),
        };
      });
    });
  }

  @Action(RoomActions.CreateRoom)
  public createRoom(
    { setState }: StateContext<RoomStore>,
    { name }: RoomActions.CreateRoom
  ): void {
    RoomState.roomService.createRoom(name).subscribe((room) => {
      setState((state) => {
        return {
          ...(state || {}),
          rooms: [new Room(room), ...state.rooms],
        };
      });
    });
  }

  @Action(RoomActions.LoadRoomById)
  public loadRoomById(
    { setState }: StateContext<RoomStore>,
    { id }: RoomActions.LoadRoomById
  ): void {
    RoomState.roomService
      .loadRoomById(id)
      .pipe(filter(isNotNullOrUndefined))
      .subscribe((room) => {
        setState((state) => {
          // Remove the room from the old list if it's there
          const oldRooms = state.rooms.filter((x) => x.id !== room.id);
          // Update the state with the new data and the old list of rooms
          return {
            ...(state || {}),
            rooms: [new Room(room), ...oldRooms],
          };
        });
      });
  }
}
