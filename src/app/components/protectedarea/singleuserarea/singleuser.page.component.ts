import {Component, OnInit, Inject} from '@angular/core';
import {AuthService} from '../../../services/auth-service';
import {Router, ActivatedRoute} from '@angular/router';
import {UserListComponent} from '../userlist/userlist.component';
import  {User, Role, Auth} from '../../../models/login-models';
import  {Subject} from 'rxjs';

@Component({
  selector: 'app-userfilter-page',
  templateUrl: './singleuser.page.component.html',
  styleUrls: ['./singleuser.page.component.scss'],
  providers: [AuthService, UserListComponent]
})
export class SingleUserFilterComponent implements OnInit {
  title: string = 'Protected Page!';
  username: string;
  name: string;
  userId: string;
  users: Subject<User[]>;
  roles: Subject<Role[]>;
  auths: Subject<Auth[]>;
  sub: any;
  selectedUser: User;
  constructor(public service: AuthService,
              @Inject(Router) public router: Router,
              @Inject(ActivatedRoute) public routes: ActivatedRoute) {
    this.sub = this.routes
      .params
      .subscribe(params => {
        // Récupération des valeurs de l'URL
        this.userId = params['user']; // --> Name must match wanted paramter
      });
  }

  ngOnInit(): void {
    this.users = this.service.byUserName(this.userId);
    this.roles = this.service.allRoles();
    this.auths = this.service.allAuths();
  }

  getUserDesc(): string {
    if ( this.users && !this.selectedUser ) {
      this.users.subscribe( (users: User[]) => {
        this.selectedUser = users.filter( (user: User) => {
          if (user.username === this.userId) {
            return user;
          }
        })[0];
      });
    }
    return this.selectedUser ? this.selectedUser.name() : '<undefined>';
  }

}
