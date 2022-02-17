import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UserService } from './shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private _userService: UserService) {}

  public async canActivate(
    next: ActivatedRouteSnapshot
  ): Promise<boolean> {
    let signedIn = this._userService.signedIn;
    if (!signedIn) {
      signedIn = await firstValueFrom(this._userService.signInFromStorage());
      if (!signedIn) {
        this._router.navigate(['/account/login']);
      }
    }

    return signedIn;
  }
}
