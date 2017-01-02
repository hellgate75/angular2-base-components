import {Component, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {CanActivateViaAuthGuard} from '../../guards/guards';
import {RouterModule, Routes} from '@angular/router';
import { AllUsersPageComponent, UserRoleFilterComponent } from './protected.sub.components';
import { PageNotFoundComponent } from '../pagenotfound/pagenotfound.component';

// References
let appProtectedRoutes: Routes = [
  {
    path: '',
    component: AllUsersPageComponent
  },
  { path: 'roles/:role', component: UserRoleFilterComponent},
  { path: '**', component: PageNotFoundComponent }
];
export const ProtectedRoutesModule = RouterModule.forChild(appProtectedRoutes);

@Component({
  selector: 'app-protected-page',
  templateUrl: './protected.page.component.html',
  providers: [AuthService, CanActivateViaAuthGuard],
  encapsulation: ViewEncapsulation.None
})
export class ProtectedPageComponent {
  title: string = 'Protected Page!';
  description: string = 'You are logged in!!';
  constructor(private service: AuthService) {
    this.service.checkLogged();
  }

  username(): string {
    return this.service.getUserId();
  }

  usercaption(): string {
    return this.service.getUserName();
  }

}
