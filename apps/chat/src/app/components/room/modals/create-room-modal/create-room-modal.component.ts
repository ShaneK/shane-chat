import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import { RxState } from '@rx-angular/state';
import { first, firstValueFrom } from 'rxjs';
import { RoomActions } from '../../../../shared/states';

export interface CreateRoomModalData {
  roomName: string;
}

interface ComponentState {}

@Component({
  selector: 'shane-chat-create-room-modal',
  templateUrl: './create-room-modal.component.html',
  styleUrls: ['./create-room-modal.component.scss'],
  providers: [RxState]
})
export class CreateRoomModalComponent implements OnInit {
  public error: string = '';

  constructor(
    private _store: Store,
    private _state: RxState<ComponentState>,
    private _actions$: Actions,
    public dialogRef: MatDialogRef<CreateRoomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateRoomModalData
  ) {}

  public ngOnInit(): void {
    this._state.hold(this.dialogRef.afterOpened(), () => {
      this.error = '';
    });
  }

  public async save(): Promise<void> {
    const result = this.data.roomName;
    if (!result.trim()) {
      return;
    }

    this._state.hold(
      this._actions$.pipe(ofActionDispatched(RoomActions.CreateRoomComplete), first()),
      ({ error }: RoomActions.CreateRoomComplete) => {
        if (!error) {
          return this.dialogRef.close();
        }

        this.error = error;
      }
    );

    this._store.dispatch(new RoomActions.CreateRoom(result.trim()));
  }
}
