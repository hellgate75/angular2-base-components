import {Component, OnInit, Inject} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserListComponent} from '../userlist/userlist.component';
import  {User, Role, Auth} from '../../../models/login-models';
import  {Subject} from 'rxjs';

@Component({
  selector: 'app-userfilter-page',
  templateUrl: './usersfilter.page.component.html',
  providers: [AuthService, UserListComponent]
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
  constructor(public service: AuthService,
              @Inject(Router) public router: Router,
              @Inject(ActivatedRoute) public routes: ActivatedRoute) {
    this.sub = this.routes
      .params
      .subscribe(params => {
        // Récupération des valeurs de l'URL
        this.roleId = params['role']; // --> Name must match wanted paramter
      });
  }

  ngOnInit(): void {
    this.users = this.service.byRole(this.roleId);
    this.roles = this.service.allRoles();
    this.auths = this.service.allAuths();
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
