import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {UserListComponent} from '../userlist/userlist.component';
import  {User, Role, Auth} from '../../../models/login-models';
import  {Subject} from 'rxjs';

@Component({
  selector: 'app-protected-page',
  styleUrls: ['./allusers.page.component.scss'],
  templateUrl: './allusers.page.component.html',
  providers: [AuthService, UserListComponent]
})
export class AllUsersPageComponent implements OnInit {
  title: string = 'All Users!';
  description: string = 'No filters applied!!';
  users: Subject<User[]>;
  roles: Subject<Role[]>;
  auths: Subject<Auth[]>;
  loading: Subject<boolean>;
  error: Subject<boolean>;
  /* tslint:disable */
  static filterText: string = '';
  /* tslint:enable */
  loadingState: boolean = false;
  errorState: boolean = false;
  change: string = AllUsersPageComponent.filterText;

  constructor(public service: AuthService) {
    this.loading = new Subject<boolean>();
    this.error = new Subject<boolean>();
    this.loading.asObservable().subscribe(
      (next: boolean) => this.loadingState = next
    );
    this.error.asObservable().subscribe(
      (next: boolean) => this.errorState = next
    );
  }

  start(event: boolean): void {
  }

  search(event: string): void {
    this.reload(event);
  }

  ngOnInit(): void {
    this.errorState = false;
    if (AllUsersPageComponent.filterText !== '') {
      this.reload(AllUsersPageComponent.filterText);
    } else {
      this.users = this.service.allUsers();
    }
    this.roles = this.service.allRoles();
    this.auths = this.service.allAuths();
  }

  isLoading(): boolean {
    return this.loadingState;
  }

  isInError(): boolean {
    return this.errorState;
  }

  reload(value: string): void {
    this.errorState = false;
    AllUsersPageComponent.filterText = value || '';
    if (!value || !value.length) {
      this.description = 'No filters applied!!';
    } else {
      this.description = 'Filtered full text as "' + value + '"';
    }
    let subscription: any;
    this.users = this.service.getUsersByFulText(subscription, value);
  }
}
