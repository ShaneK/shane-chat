import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { EmptyLayoutComponent } from './components/layout/empty-layout/empty-layout.component';
import { PrimaryHeaderComponent } from './components/layout/primary-header/primary-header.component';
import { PrimaryNavComponent } from './components/layout/primary-nav/primary-nav.component';
import { LoginComponent } from './components/login/login.component';
import { RouteNotFoundComponent } from './components/route-not-found/route-not-found.component';

const routes: Routes = [
  {
    path: 'account/login',
    children: [
      {
        path: '',
        component: EmptyLayoutComponent,
        outlet: 'header',
      },
      {
        path: '',
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'room/list',
      },
      {
        path: 'room',
        loadChildren: () =>
          import('./components/room/room.module').then((m) => m.RoomModule),
      },
      {
        path: '',
        component: PrimaryNavComponent,
        outlet: 'navbar',
      },
      {
        path: '',
        component: PrimaryHeaderComponent,
        outlet: 'header',
      },
      {
        // 404 Error Handling
        path: '**',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: RouteNotFoundComponent,
          },
        ],
      },
    ],
  },
];

@Injectable()
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
