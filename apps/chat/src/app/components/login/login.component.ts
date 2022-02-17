import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { isNotNullOrUndefined } from '@shane-chat/helpers';
import { catchError, filter, firstValueFrom, of, tap } from 'rxjs';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'shane-chat-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    rememberMe: new FormControl(false),
  });
  public errorMessage: string = '';

  constructor(private _userService: UserService, private _router: Router) {}

  public async ngOnInit(): Promise<void> {
    if (this._userService.signedIn) {
      await this._router.navigate(['/']);
      return;
    }
  }

  public async login(): Promise<void> {
    this.errorMessage = '';
    if (!this.form.valid) {
      return;
    }

    const user = await firstValueFrom(
      this._userService.getUserByName(this.form.value.name)
    );
    if (!user) {
      this.errorMessage = 'User not found.';
      return;
    }

    this._userService.signIn(user, this.form.value.rememberMe);
    await this._router.navigate(['/']);
  }

  public async register(): Promise<void> {
    this.errorMessage = '';
    if (!this.form.valid) {
      return;
    }

    this._userService
      .registerUserByName(this.form.value.name)
      .pipe(
        catchError(({ error }) => {
          this.errorMessage = error;
          return of(null);
        }),
        filter(isNotNullOrUndefined),
        tap((user) => {
          this._userService.signIn(user, this.form.value.rememberMe);
          this._router.navigate(['/']);
        })
      )
      .subscribe();
  }
}
