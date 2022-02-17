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

  /**
   * This method intercepts all http requests and adds the user id to the request headers, which
   * is used by the API to identify the user when they create rooms or post messages in them.
   *
   * It can also prepend `/api/` to the request url if it's not already there, which is just for convenience.
   *
   * @param req
   * @param next
   */
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
