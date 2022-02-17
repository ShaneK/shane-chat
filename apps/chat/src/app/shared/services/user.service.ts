import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@shane-chat/models';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public static readonly USER_STORAGE_KEY = 'shane-chat:user-id'
  public static user?: User;

  constructor(private _http: HttpClient) {}

  public get signedIn(): boolean {
    return !!UserService.user?.id;
  }

  public getUserByName(name: string): Observable<User | null> {
    return this._http
      .get<User>(`/api/user/search/name/${name}`)
      .pipe(map((user) => (user ? new User(user) : null)));
  }

  public getUserById(id: string): Observable<User | null> {
    return this._http
      .get<User>(`/api/user/search/id/${id}`)
      .pipe(map((user) => (user ? new User(user) : null)));
  }

  public registerUserByName(name: string): Observable<User | null> {
    return this._http
      .post<User>(`/api/user`, { name })
      .pipe(map((user) => (user ? new User(user) : null)));
  }

  public signIn(user: User, rememberMe: boolean): void {
    if (!user) {
      return;
    }

    UserService.user = user;
    if (rememberMe) {
      localStorage.setItem(UserService.USER_STORAGE_KEY, user.id);
    }
  }

  public signOut(): void {
    UserService.user = undefined;
    localStorage.removeItem(UserService.USER_STORAGE_KEY);
  }

  public signInFromStorage(): Observable<boolean> {
    const userId = localStorage.getItem(UserService.USER_STORAGE_KEY);
    if (userId) {
      return this.getUserById(userId).pipe(map(user => {
        if (user) {
          UserService.user = user;
          return true;
        }

        localStorage.removeItem(UserService.USER_STORAGE_KEY);
        return false;
      }));
    }

    return of(false);
  }
}
