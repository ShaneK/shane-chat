import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { RxState } from '@rx-angular/state';
import { Message, Room, User } from '@shane-chat/models';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { MessageService, SseService, UserService } from '../../../shared';
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
    private _messageService: MessageService,
    private _sseService: SseService
  ) {}

  public ngOnInit(): void {
    this._state.set({ user: UserService.user });
    this._state.hold(this._route.params, ({ id }) => {
      this._store.dispatch(new RoomActions.LoadRoomById(id));
      this._state.connect(
        'room',
        this._store
          .select(RoomState.roomById(id))
          .pipe(tap(() => this._scrollToBottom()))
      );
      this._state.hold(
        this._sseService.getServerSentEvent(`/api/room/stream/sse/${id}`),
        ({ data }) => {
          const { room } = this._state.get();
          try {
            const message = new Message(JSON.parse(data));
            this._state.set({
              room: new Room({
                ...(room || {}),
                messages: [...(room?.messages || []), message],
              }),
            });
            this._scrollToBottom();
          } catch {}
        }
      );
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
    setTimeout(() => {
      if (this.chat?.nativeElement) {
        this.chat.nativeElement.scrollTop =
          this.chat?.nativeElement.scrollHeight;
      }
    });
  }
}
