import {Component, OnInit, Inject} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserListComponent} from '../userlist/userlist.component';
import  {User, Role, Auth} from '../../../models/login-models';
import  {Subject} from 'rxjs';
import { SortingBoxComponent } from '../../sortingbox/sorting-box-component';
import { AllUsersPageComponent } from '../allusersrarea/allusers.page.component';
import { SortingItem, SORTING_STATE, Sorter } from '../../../models/back-end-model';
import { USERS_SERVICE_META_KEY } from '../../../shared/constants';

@Component({
  selector: 'app-userfilter-page',
  templateUrl: './usersfilter.page.component.html',
  styleUrls: ['./usersfilter.page.component.scss'],
  providers: [AuthService, UserListComponent, SortingBoxComponent]
})
export class UserRoleFilterComponent implements OnInit {
  title: string = 'Protected Page!';
  username: string;
  name: string;
  roleId: string;
  users: Subject<User[]>;
  roles: Subject<Role[]>;
  auths: Subject<Auth[]>;
  sub: any;
  selectedRole: Role;

  currentItem: SortingItem = AllUsersPageComponent.selectedItem;
  sortingItems: SortingItem[] = [];
  sorter: Sorter;

  defautSortingItem: SortingItem;

  constructor(public service: AuthService,
              @Inject(Router) public router: Router,
              @Inject(ActivatedRoute) public routes: ActivatedRoute,
              @Inject(USERS_SERVICE_META_KEY) private usersMeta: any) {
    this.sub = this.routes
      .params
      .subscribe(params => {
        // Récupération des valeurs de l'URL
        this.roleId = params['role']; // --> Name must match wanted paramter
      });
    this.usersMeta.sorting.forEach((sortItem: any) => {
      if (!!sortItem.default) {
        this.defautSortingItem = new SortingItem(sortItem.id, sortItem.name, <SORTING_STATE>sortItem.sort, !!sortItem.cortocircuit);
      }
      this.sortingItems.push (new SortingItem(sortItem.id, sortItem.name, sortItem.sort, !!sortItem.cortocircuit));
    });
/*
    this.sortingItems.push (new SortingItem('username', 'User Name'));
    this.sortingItems.push (new SortingItem('surname', 'Last Name'));
    this.sortingItems.push (new SortingItem('firstname', 'First Name'));
    this.defautSortingItem = new SortingItem('id', 'Identifier', SORTING_STATE.ASCENDING, true);
    this.sortingItems.push (new SortingItem('id', 'Identifier', SORTING_STATE.ASCENDING, true));
*/
  }

  sorted(selectedItem: SortingItem): void {
    AllUsersPageComponent.selectedItem =
      (!selectedItem || selectedItem.state === SORTING_STATE.NONE ? this.defautSortingItem.clone() : selectedItem);
    this.evaluateSorting();
    this.reload(AllUsersPageComponent.filterText);
  }

  evaluateSorting(): void {
    if (!!AllUsersPageComponent.selectedItem && AllUsersPageComponent.selectedItem.state !== SORTING_STATE.NONE) {
      this.sorter = new Sorter(AllUsersPageComponent.selectedItem.key,
        AllUsersPageComponent.selectedItem.state === SORTING_STATE.ASCENDING);
      if (!!AllUsersPageComponent.selectedItem && AllUsersPageComponent.selectedItem.key === this.defautSortingItem.key &&
        AllUsersPageComponent.selectedItem.state === this.defautSortingItem.state) {
        this.sortingItems.filter((next: SortingItem) => { return next.key === this.defautSortingItem.key; } )
          .forEach((next: SortingItem) => { return next.state = this.defautSortingItem.state; });
      }
    } else {
      this.sorter = null;
    }
  }

  ngOnInit(): void {
    this.evaluateSorting();
    this.users = this.service.byRole(this.roleId, this.sorter);
    this.roles = this.service.allRoles();
    this.auths = this.service.allAuths();
  }

  reload(value: string): void {
    AllUsersPageComponent.filterText = value || '';
    this.users = this.service.byRole(this.roleId, this.sorter);
  }

  getRoleDesc(): string {
    if ( this.roles && !this.selectedRole ) {
      this.roles.subscribe( (roles: Role[]) => {
        this.selectedRole = roles.filter( (role: Role) => {
          if (role.id === this.roleId) {
            return role;
          }
        })[0];
      });
    }
    return this.selectedRole ? this.selectedRole.name : '<undefined>';
  }

}
