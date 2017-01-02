// Providers
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';

// Components
import { PageNotFoundComponent } from '../pagenotfound/pagenotfound.component';
import {ProtectedPageComponent} from './protected.page.component';
import { AllUsersPageComponent, UserRoleFilterComponent, UserListComponent } from './protected.sub.components';


// References
let appProtectedRoutes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: AllUsersPageComponent
  },
  { path: 'users/:role', component: UserRoleFilterComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    ProtectedPageComponent,
    PageNotFoundComponent,
    AllUsersPageComponent,
    UserRoleFilterComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forChild(appProtectedRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/users'},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [ProtectedPageComponent]
})
export class AppProtectedModule { }
