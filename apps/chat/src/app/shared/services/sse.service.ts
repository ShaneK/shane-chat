import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  constructor(private _zone: NgZone) {}

  public getEventSource(uri: string): EventSource {
    return new EventSource(uri);
  }

  public getServerSentEvent<T = any>(uri: string): Observable<MessageEvent<T>> {
    return new Observable((observer) => {
      const eventSource = this.getEventSource(uri);

      eventSource.onmessage = (event) => {
        this._zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = (error) => {
        this._zone.run(() => {
          observer.error(error);
        });
      };

      return () => {
        eventSource.close();
      };
    });
  }
}
