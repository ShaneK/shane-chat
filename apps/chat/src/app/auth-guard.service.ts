import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from './shared/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private _userService: UserService) {}

  public async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
    // Check if the user is signed in or try to sign them in from localstorage
    let signedIn = this._userService.signedIn;
    if (!signedIn) {
      signedIn = await firstValueFrom(this._userService.signInFromStorage());
      if (!signedIn) {
        // If that fails, we send them to the login page
        this._router.navigate(['/account/login']);
      }
    }

    return signedIn;
  }
}
