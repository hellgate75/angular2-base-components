import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized-page',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnAuthotorizedComponent {
  title: string = 'Page Not Authorized!';
  description: string = 'Please login before access this content!!';
}
