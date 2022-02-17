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

  /**
   * Turn SSE streams into an observable we can subscribe to.
   * Currently, not used but would like to use it for real-time updates.
   *
   * @param uri
   */
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
