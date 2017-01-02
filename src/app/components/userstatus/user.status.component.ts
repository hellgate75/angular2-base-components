import {Component, ElementRef, Inject} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-user-status',
  providers: [AuthService],
  templateUrl: './user.status.component.html',
  styleUrls: ['./user.status.component.scss']
})
export class UserStatusComponent {
  elementRef: ElementRef;
  constructor(public authService: AuthService,
              @Inject(Router) private router: Router,
              @Inject(ElementRef) elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  logout(): boolean {
    this.authService.logout();
    this.router.navigate(['/main'])
     return false;
  }
}
