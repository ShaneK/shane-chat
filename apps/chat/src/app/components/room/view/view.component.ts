import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { RxState } from '@rx-angular/state';
import { Room, User } from '@shane-chat/models';
import { firstValueFrom, Observable } from 'rxjs';
import { MessageService, UserService } from '../../../shared';
import { RoomActions } from '../../../shared/states';
import { RoomState } from '../../../shared/states/room/room.state';

interface ComponentState {
  room?: Room;
  user: User;
}

@Component({
  selector: 'shane-chat-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [RxState],
})
export class ViewComponent implements OnInit, AfterViewInit {
  @ViewChild('chat') chat?: ElementRef<HTMLDivElement>;

  public state$: Observable<ComponentState> = this._state.select();
  public messageMaxLength: number = 2000;
  public message: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _state: RxState<ComponentState>,
    private _store: Store,
    private _messageService: MessageService
  ) {}

  public ngOnInit(): void {
    this._state.set({ user: UserService.user });
    this._state.hold(this._route.params, ({ id }) => {
      this._store.dispatch(new RoomActions.LoadRoomById(id));
      this._state.connect('room', this._store.select(RoomState.roomById(id)));
    });
  }

  public ngAfterViewInit(): void {
    this._scrollToBottom();
  }

  public async sendMessage(): Promise<void> {
    const { room } = this._state.get() || {};
    if (
      !room ||
      !this.message.length ||
      this.message.length > this.messageMaxLength
    ) {
      return;
    }

    await firstValueFrom(
      this._messageService.createMessage(this.message, room.id)
    );
    this.message = '';
  }

  private _scrollToBottom(): void {
    if (this.chat?.nativeElement) {
      this.chat.nativeElement.scrollTop = this.chat?.nativeElement.scrollHeight;
    }
  }
}
