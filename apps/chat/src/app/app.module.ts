import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { EmptyLayoutComponent } from './components/layout/empty-layout/empty-layout.component';
import { PrimaryHeaderComponent } from './components/layout/primary-header/primary-header.component';
import { PrimaryNavComponent } from './components/layout/primary-nav/primary-nav.component';
import { LoginComponent } from './components/login/login.component';
import { RouteNotFoundComponent } from './components/route-not-found/route-not-found.component';
import { RoutingModule } from './routing.module';
import { HttpInterceptorService } from './shared';
import { states } from './shared/states';

@NgModule({
  declarations: [
    AppComponent,
    RouteNotFoundComponent,
    EmptyLayoutComponent,
    PrimaryNavComponent,
    PrimaryHeaderComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    RoutingModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatToolbarModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    NgxsModule.forRoot(states, {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
        injectContainerState: false,
      },
    }),
    MatIconModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
