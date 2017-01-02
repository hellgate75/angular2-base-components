import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate() {
    let isLoggedIn: boolean = this.authService.isLogged();
    if (!isLoggedIn) {
      this.router.navigate(['/unauthorized']);
    }
    return isLoggedIn;
  }
}
