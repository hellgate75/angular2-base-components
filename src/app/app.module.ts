// Providers
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';

// Components
import { AppComponent, APP_ELEMENT_ROOT } from './components/app.component';
import { WelcomeComponent } from './components/welcomepage/app.welcome.component';
import { UnAuthotorizedComponent } from './components/unauthorizedpage/unauthorized.component';
import { AddressBookComponent, AddressBookTableComponent } from './components/addressbook/app.addressbook.component';
import {ProtectedPageComponent} from './components/protectedarea/protected.page.component';
import {LoginComponent} from './components/loginpage/app.login.component';
import {UserStatusComponent} from './components/userstatus/user.status.component';
import { AllUsersPageComponent, UserRoleFilterComponent, UserListComponent, UserListTableComponent,
  SingleUserFilterComponent }  from './components/protectedarea/protected.sub.components';
import { PageNotFoundComponent } from './components/pagenotfound/pagenotfound.component';
import { FilterBoxComponent } from './components/filterbox/filter-box-component';
import { SortingBoxComponent, SortingBoxItemComponent } from './components/sortingbox/sorting-box-component';
import { EditDialogComponent } from './components/editcomponent/edit-dialog-component';
import { EditFormComponent } from './components/editcomponent/editform/edit-form-component';
import { EditElementComponent } from './components/editcomponent/formelement/form-element-component';

// Services
import { AddressBookService } from './services/address-book-service';
import { AuthService } from './services/auth-service';
import { CanActivateViaAuthGuard, CanActivateLoginGuard } from './guards/guards';
import { BackEndService } from './services/back-end-service';

// External Services
import { serviceServer, appConfig } from '../environments/environment';
import {OBJECT_SERVICE_SERVER_CONF, OBJECT_APPLICATION_CONF, OBJECT_BASE64_ENC,
        USERS_SERVICE_META_KEY, CONTACTS_SERVICE_META_KEY} from './shared/constants';

// Meta data
const usersMeta = require('./config/users.metadata.json');
const contactsMeta = require('./config/contacts.metadata.json');

import { ServiceServer, AppEnv } from './shared/app-env.interface';

let SERVICE_SERVER: ServiceServer = <ServiceServer>serviceServer;
let APPLICATION_ENV: AppEnv = <AppEnv>appConfig;
const base64 = require('base-64/base64.js');

// Services
import { Utils, SESSION_KEY } from './utils/utils';

// References
let appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  { path: 'main', component: WelcomeComponent },
  { path: 'addressbook', component: AddressBookComponent },
  { path: 'login',
    component: LoginComponent,
    canActivate: [
      CanActivateLoginGuard
    ]
  },
  { path: 'unauthorized', component: UnAuthotorizedComponent },
  { path: 'protected',
    component: ProtectedPageComponent,
    canActivate: [
      CanActivateViaAuthGuard
    ],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: AllUsersPageComponent
      },
      { path: 'users/:role', component: UserRoleFilterComponent},
      { path: 'user/:user', component: SingleUserFilterComponent},
      { path: '**', component: PageNotFoundComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    UnAuthotorizedComponent,
    AddressBookComponent,
    AddressBookTableComponent,
    ProtectedPageComponent,
    LoginComponent,
    UserStatusComponent,
    AllUsersPageComponent,
    UserRoleFilterComponent,
    UserListComponent,
    SingleUserFilterComponent,
    UserListTableComponent,
    PageNotFoundComponent,
    FilterBoxComponent,
    SortingBoxComponent,
    SortingBoxItemComponent,
    EditDialogComponent,
    EditFormComponent,
    EditElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanActivateViaAuthGuard,
    CanActivateLoginGuard,
    {provide: CONTACTS_SERVICE_META_KEY, useValue: contactsMeta},
    {provide: USERS_SERVICE_META_KEY, useValue: usersMeta},
    {provide: OBJECT_BASE64_ENC, useValue: base64},
    {provide: OBJECT_APPLICATION_CONF, useValue: APPLICATION_ENV},
    {provide: OBJECT_SERVICE_SERVER_CONF, useValue: SERVICE_SERVER},
    {provide: Utils, useClass: Utils},
    {provide: BackEndService, useClass: BackEndService},
    {provide: AuthService, useClass: AuthService},
    {provide: AddressBookService, useClass: AddressBookService},
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: APP_ELEMENT_ROOT, useValue: APP_ELEMENT_ROOT},
    {provide: SESSION_KEY, useValue: SESSION_KEY}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
