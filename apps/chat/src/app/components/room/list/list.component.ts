import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { RxState } from '@rx-angular/state';
import { Room } from '@shane-chat/models';
import { Observable } from 'rxjs';
import { RoomActions } from '../../../shared/states';
import { RoomState } from '../../../shared/states/room/room.state';
import { CreateRoomModalComponent } from '../modals/create-room-modal/create-room-modal.component';

interface ComponentState {
  rooms: Room[];
}

@Component({
  selector: 'shane-chat-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  public state$: Observable<ComponentState> = this._state.select();

  constructor(
    private _store: Store,
    private _state: RxState<ComponentState>,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this._state.connect('rooms', this._store.select(RoomState.rooms));
    this._store.dispatch(new RoomActions.ListRooms());

    this._state.hold(this._state.select('rooms'), (rooms) => {
      console.log(rooms);
    });
  }

  public async openCreateDialog(): Promise<void> {
    const dialogRef = this.dialog.open(CreateRoomModalComponent, {
      width: '350px',
      data: { roomName: '' },
    });
  }
}
