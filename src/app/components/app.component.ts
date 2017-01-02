import { Component, Inject, ViewEncapsulation, HostListener } from '@angular/core';
import {Location} from '@angular/common';
import { UserStatusComponent } from './userstatus/user.status.component';
import { AuthService } from '../services/auth-service';

declare var $: any;

export const APP_ELEMENT_ROOT = [
  {
    name: 'Home',
    path: '/main',
    description: 'Home Page'
  },
  {
    name: 'Address Book',
    path: '/addressbook',
    description: 'Address Book Page'
  },
  {
    name: 'Log-In',
    path: '/login',
    description: 'Login Protected Area'
  },
  {
    name: 'Protected Area',
    path: '/protected',
    description: 'Protected Area Page'
  }
];


@Component({
  selector: 'app-root',
  providers: [ UserStatusComponent ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = 'Angular2 Simple Router Navigation App';

  constructor(public location: Location,
              @Inject(APP_ELEMENT_ROOT) public routes: any[],
              @Inject(AuthService) private authService: AuthService) {
    this.authService.checkLogged();
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event: any): void {
    if (window.closed) {
      this.authService.logout();
    }
  }

  isHidden(path: string): boolean {

    if (path === '/login') {
      return this.authService ? this.authService.isLogged() : false;
    } else  {
      return false;
    }
  }

  getLinkStyle(path: string): boolean {

    if (path === this.location.path()) {
      return true;
    } else if (path.length > 0) {
      return this.location.path().indexOf(path) > -1;
    }
  }
}
