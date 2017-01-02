import {Component, ElementRef, OnInit, Inject} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import { CanActivateLoginGuard } from '../../guards/guards';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  providers: [AuthService, CanActivateLoginGuard],
  templateUrl: './app.login.component.html',
  styleUrls: ['./app.login.component.scss']
})
export class LoginComponent implements OnInit {
  message: string;
  message2: string;
  timeToGo: number;
  interval: any;
  title: string = 'Login Page';
  description: string = 'Please login with your credentials';
  buttonSelector: any;
  elementRef: ElementRef;
  loading: boolean = false;

  constructor(public authService: AuthService,
              @Inject(Router) public router: Router,
              @Inject(ElementRef) elementRef: ElementRef) {
    this.message = '';
    this.message2 = 'Login succeded.';
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.buttonSelector = jQuery(this.elementRef.nativeElement).find('.btn.btn-default.start');
  }

  login(username: string, password: string): void {
    this.loading = true;
    this.message = '';
    this.timeToGo = 10;
    this.authService.login(username, password).subscribe(
      (next: boolean) => {
        this.loading = false;
        if (next) {
          this.interval = setInterval( () => { this.timeToGo--; if (!this.timeToGo) { clearInterval(this.interval); } }, 1000);
          setTimeout(() => { this.router.navigate(['/main']); }, 11000);
        } else {
          this.message = 'Incorrect credentials.';
          setTimeout(function() {
            this.message = '';
          }.bind(this), 4000);
        }
      }
    );

/*
    // Removed this synchronous login for an asynchronous one ....
    if (!this.authService.login(username, password)) {
      this.message = 'Incorrect credentials.';
      /!* tslint:disable *!/
      setTimeout(function() {
        this.message = '';
        this.loading = false;
      }.bind(this), 4000);
      /!* tslint:enable *!/
    }
    setTimeout(function() {
      this.loading = false;
    }.bind(this), 500);
    return false;
*/
  }
  username(): string {
    return this.authService.getUserName();
  }
  loggedIn(): boolean {
    return this.authService.isLogged();
  }

  logout(): boolean {
    this.authService.logout();
    return false;
  }
}
