import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@shane-chat/models';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'shane-chat-primary-header',
  templateUrl: './primary-header.component.html',
  styleUrls: ['./primary-header.component.scss']
})
export class PrimaryHeaderComponent {
  public user?: User = UserService.user;

  constructor(private _userService: UserService, private _router: Router) { }

  public logout(): void {
    this._userService.signOut();
    this._router.navigate(['/account', 'login']);
  }
}
