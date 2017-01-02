import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User, Role, Auth } from '../../../models/login-models';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-user-list-table',
  providers: [],
  templateUrl: './userlist.table.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserListTableComponent implements OnInit {
  @Input() users: User[];
  @Input() roles: Role[];
  @Input() auths: Auth[];

  constructor() {
  }

  ngOnInit(): void {
  }

  getRoleDesc(roleId: string): string {
    let selectedRole: Role = this.roles ? (this.roles.filter( (role: Role) => { if (role.id === roleId) {
      return role;
    } })[0] || null) : null;
    return selectedRole ? selectedRole.name : '<undefined>';
  }
  getRoleAuths(roleId: string): string[] {
    let selectedRole: Role = this.roles ? (this.roles.filter( (role: Role) => { if (role.id === roleId) {
      return role;
    } })[0] || null) : null;
    return selectedRole ? selectedRole.auth : [];
  }
  getAuthDesc(authId: string): string {
    let selectedAuth: Auth = this.auths ? (this.auths.filter( (auth: Auth) => { if (auth.id === authId) {
      return auth;
    } })[0] || null) : null;
    return selectedAuth ? selectedAuth.name : '<undefined>';
  }
  getAuthType(authId: string): string {
    let selectedAuth: Auth = this.auths ? (this.auths.filter( (auth: Auth) => { if (auth.id === authId) {
      return auth;
    } })[0] || null) : null;
    return selectedAuth ? selectedAuth.type : '<undefined>';
  }

}

@Component({
  selector: 'app-user-list',
  providers: [UserListTableComponent],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserListComponent implements OnInit, OnChanges {
  users: User[] = [];
  roles: Role[] = [];
  auths: Auth[] = [];
  @Input() usersSubject: Subject<User[]>;
  @Input() rolesSubject: Subject<Role[]>;
  @Input() authsSubject: Subject<Auth[]>;
  @Input() loadingSubject: Subject<boolean>;
  @Input() errorSubject: Subject<boolean>;

  constructor() {
   }

  ngOnInit(): void {
    this.usersSubject.subscribe(
      (users: User[]) => { this.users = users; },
      (err: any) => {
        if (!!this.errorSubject) {
          this.errorSubject.next(true);
        }
      }
    );
    this.rolesSubject.subscribe(
      (roles: Role[]) => { this.roles = roles; }
    );
    this.authsSubject.subscribe(
      (auths: Auth[]) => { this.auths = auths; }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.hasOwnProperty('usersSubject') &&
      !!changes['usersSubject'].hasOwnProperty('previousValue') &&
      !!changes['usersSubject']['previousValue'].hasOwnProperty('observers')) {
      if (this.loadingSubject) {
        this.loadingSubject.next(true);
      }
      this.usersSubject.subscribe(
        (users: User[]) => {
          this.users.splice(0, this.users.length);
          this.users = users;
        },
        (err: any) => {
          if (this.loadingSubject) {
            setTimeout(() => {
              this.loadingSubject.next(false);
              this.errorSubject.next(true);
            }, 500);
          }
        },
        () => {
          if (this.loadingSubject) {
            setTimeout(() => {
              this.loadingSubject.next(false);
            }, 500);
          }
        }
      );
    }
  }
}

