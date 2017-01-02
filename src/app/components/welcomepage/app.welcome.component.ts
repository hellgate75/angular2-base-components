import { Component } from '@angular/core';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-welcome-page',
  providers: [ AuthService ],
  templateUrl: './app.welcome.component.html',
  styleUrls: ['./app.welcome.component.scss']
})
export class WelcomeComponent {
  title: string = 'Welcome ';
  title2: string = '!';
  description: string = `This is a simple Router navigation application. 
This app is adaptative but it is not completely mobile-friendly`;
  constructor(private authService: AuthService) {
  }
  username(): string {
    return this.authService.getUserName() || 'Guest';
  }
}
