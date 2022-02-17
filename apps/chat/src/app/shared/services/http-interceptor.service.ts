/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService {
  constructor() {}

  public intercept(
    req: HttpRequest<never>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let url = req.url;
    if (url.indexOf('/') === 0 && url.indexOf('/api') !== 0) {
      url = `/api/${url}`;
    }

    const userId = UserService?.user?.id;
    if (!userId) {
      req = req.clone({
        url: url,
      });
    } else {
      req = req.clone({
        url: url,
        setHeaders: {
          UserId: `${userId}`,
        },
      });
    }

    return next.handle(req);
  }
}
