import { Injectable, Injector } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { isNotNullOrUndefined } from '@shane-chat/helpers';
import { Room } from '@shane-chat/models';
import { filter } from 'rxjs';
import { RoomService } from '../../services';

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

  export class CreateRoomComplete {
    public static type = '[RoomState] Create room complete';
    constructor(public error?: string) {}
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
          rooms: rooms
            .map((x) => new Room(x))
            .sort((a, b) => {
              if (a.last_activity < b.last_activity) {
                return 1;
              }

              if (a.last_activity > b.last_activity) {
                return -1;
              }

              return 0;
            }),
        };
      });
    });
  }

  @Action(RoomActions.CreateRoom)
  public createRoom(
    { setState, dispatch }: StateContext<RoomStore>,
    { name }: RoomActions.CreateRoom
  ): void {
    RoomState.roomService.createRoom(name).subscribe({
      next: (room) => {
        setState((state) => {
          return {
            ...(state || {}),
            rooms: [new Room(room), ...state.rooms].sort((a, b) => {
              if (a.last_activity < b.last_activity) {
                return 1;
              }

              if (a.last_activity > b.last_activity) {
                return -1;
              }

              return 0;
            }),
          };
        });
        dispatch(new RoomActions.CreateRoomComplete());
      },
      error: (err) => {
        dispatch(new RoomActions.CreateRoomComplete(err.error));
      },
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
