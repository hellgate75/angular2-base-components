import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {UserListComponent} from '../userlist/userlist.component';
import  {User, Role, Auth} from '../../../models/login-models';
import  {Subject} from 'rxjs';
import { FilterBoxComponent } from '../../filterbox/filter-box-component';
import { SortingBoxComponent } from '../../sortingbox/sorting-box-component';
import { SortingItem, SORTING_STATE, Sorter } from '../../../models/back-end-model';

@Component({
  selector: 'app-protected-page',
  styleUrls: ['./allusers.page.component.scss'],
  templateUrl: './allusers.page.component.html',
  providers: [AuthService, UserListComponent, FilterBoxComponent, SortingBoxComponent]
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
  /* tslint:disable */
  static selectedItem: SortingItem = new SortingItem('id', 'Identifier', SORTING_STATE.ASCENDING, true);
  /* tslint:enable */
  currentItem: SortingItem = AllUsersPageComponent.selectedItem;
  sortingItems: SortingItem[] = [];
  sorter: Sorter;
  defautSortingItem: SortingItem;

  constructor(public service: AuthService) {
    this.loading = new Subject<boolean>();
    this.error = new Subject<boolean>();
    this.loading.asObservable().subscribe(
      (next: boolean) => this.loadingState = next
    );
    this.error.asObservable().subscribe(
      (next: boolean) => this.errorState = next
    );
    this.sortingItems.push (new SortingItem('role', 'Role'));
    this.sortingItems.push (new SortingItem('username', 'User Name'));
    this.sortingItems.push (new SortingItem('surname', 'Last Name'));
    this.sortingItems.push (new SortingItem('firstname', 'First Name'));
    this.defautSortingItem = new SortingItem('id', 'Identifier', SORTING_STATE.ASCENDING, true);
    this.sortingItems.push (new SortingItem('id', 'Identifier', SORTING_STATE.ASCENDING, true));
  }

  start(event: boolean): void {
  }

  search(event: string): void {
    this.reload(event);
  }

  sorted(selectedItem: SortingItem): void {
    AllUsersPageComponent.selectedItem =
      (!selectedItem || selectedItem.state === SORTING_STATE.NONE ? this.defautSortingItem.clone() : selectedItem);
    if (!!AllUsersPageComponent.selectedItem && AllUsersPageComponent.selectedItem.key === this.defautSortingItem.key &&
      AllUsersPageComponent.selectedItem.state === this.defautSortingItem.state) {
      this.sortingItems.filter((next: SortingItem) => { return next.key === this.defautSortingItem.key; } )
        .forEach((next: SortingItem) => { return next.state = this.defautSortingItem.state; });
    }
    this.evaluateSorting();
    this.reload(AllUsersPageComponent.filterText);
  }

  evaluateSorting(): void {
    if (!!AllUsersPageComponent.selectedItem && AllUsersPageComponent.selectedItem.state !== SORTING_STATE.NONE) {
      this.sorter = new Sorter(AllUsersPageComponent.selectedItem.key,
        AllUsersPageComponent.selectedItem.state === SORTING_STATE.ASCENDING);
    } else {
      this.sorter = null;
    }
  }

  ngOnInit(): void {
    this.evaluateSorting();
    this.errorState = false;
    if (AllUsersPageComponent.filterText !== '') {
      this.reload(AllUsersPageComponent.filterText);
    } else {
      this.users = this.service.allUsers(this.sorter);
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
    this.users = this.service.getUsersByFulText(subscription, value, this.sorter);
  }
}
