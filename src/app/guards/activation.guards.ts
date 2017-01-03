import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate() : boolean {
    let isLoggedIn: boolean = this.authService.isLogged();
    if (!isLoggedIn) {
      this.router.navigate(['/unauthorized']);
    }
    return isLoggedIn;
  }
  canActivateChild(): boolean {
    return this.canActivate();
  }
}
