import {Injectable, Inject} from '@angular/core';
import { SESSION_KEY } from '../utils/utils';
import {Subject} from 'rxjs';
import {User, Role, Auth, Session} from '../models/login-models';
import { BackEndService } from './back-end-service';
import {OBJECT_BASE64_ENC, USER_SESSION_KEY} from '../shared/constants';
import { Request, Filter, FILTER_TYPE } from '../models/back-end-model';
import { CloneableCreator } from '../models/base-model';
import { SESSIONS_SERVICE, USERS_SERVICE, ROLES_SERVICE, AUTHS_SERVICE, USERS_SERVICE_USERNAME_PARAMETER,
        USERS_SERVICE_ROLE_PARAMETER, SERVICES_INDEX_PARAMETER } from '../shared/constants';

@Injectable()
export class AuthService {
  subscription: any;
  booleanChain: Subject<boolean>;
  subscription1: any;
  userChain1: Subject<User[]>;
  subscription2: any;
  userChain2: Subject<User[]>;
  subscription3: any;
  userChain3: Subject<User[]>;
  /* tslint:disable */
  public static session: Session;
  /* tslint:enable */

  firstLoad: boolean = false;

  constructor(@Inject(SESSION_KEY) public sessionKey: string,
              @Inject(BackEndService) public backendService: BackEndService,
              @Inject(OBJECT_BASE64_ENC) private base64Module: any) {
    this.checkLogged();
  }

  getUsers(subscription: any): Subject<User[]> {
    let create: Subject<User[]> = new Subject<User[]>();
    let request: Request = Request.AsFullItemList(USERS_SERVICE);
    subscription = this.backendService.requireServiceQuery<User>(create, request, new CloneableCreator(User));
    return create;
  }

  getUsersByKey(subscription: any, key: string, value: any): Subject<User[]> {
    let create: Subject<User[]> = new Subject<User[]>();
    let filter: Filter = new Filter(FILTER_TYPE.KEYVALUE, key, value);
    let request: Request = Request.AsQuery(USERS_SERVICE, filter);
    subscription = this.backendService.requireServiceQuery<User>(create, request, new CloneableCreator(User));
    return create;
  }

  getUsersByFulText(subscription: any, value: any): Subject<User[]> {
    let create: Subject<User[]> = new Subject<User[]>();
    let filter: Filter = new Filter(FILTER_TYPE.FULL_TEXT);
    filter.fullText = value;
    let request: Request = Request.AsQuery(USERS_SERVICE, filter);
    subscription = this.backendService.requireServiceQuery<User>(create, request, new CloneableCreator(User));
    return create;
  }

  getRoles(subscription: any): Subject<Role[]> {
    let create: Subject<Role[]> = new Subject<Role[]>();
    let request: Request = Request.AsFullItemList(ROLES_SERVICE);
    subscription = this.backendService.requireServiceQuery<Role>(create, request, new CloneableCreator(Role));
    return create;
  }

  getAuths(subscription: any): Subject<Auth[]> {
    let create: Subject<Auth[]> = new Subject<Auth[]>();
    let request: Request = Request.AsFullItemList(AUTHS_SERVICE);
    subscription = this.backendService.requireServiceQuery<Auth>(create, request, new CloneableCreator(Auth));
    return create;
  }

  loadSession(subscription: any, sessionKey: string): Subject<Session[]> {
    this.firstLoad = true;
    let response: Subject<Session[]> = new Subject<Session[]>();
    let filter: Filter = new Filter(FILTER_TYPE.KEYVALUE, SERVICES_INDEX_PARAMETER, sessionKey);
    let request: Request = Request.AsQuery(SESSIONS_SERVICE, filter);
    subscription = this.backendService.requireServiceQuery<Session>(response, request, new CloneableCreator(Session));
    return response;
  }

  insertSession(subscription: any, sessionKey: string, session: Session): Subject<boolean> {
    let response: Subject<boolean> = new Subject<boolean>();
    let request: Request = Request.AsInsert(SESSIONS_SERVICE, sessionKey, session);
    subscription = this.backendService.requireServiceDML(response, request);
    return response;
  }

  deleteSession(subscription: any, sessionKey: string): Subject<boolean> {
    let response: Subject<boolean> = new Subject<boolean>();
    let request: Request = Request.AsDelete(SESSIONS_SERVICE, sessionKey);
    subscription = this.backendService.requireServiceDML(response, request);
    return response;
  }

  login(username: string, password: string): Subject<boolean> {
    let encoded: string = this.base64Module.encode(password);
    if (!this.booleanChain) {
      this.booleanChain = new Subject<boolean>();
      let userByUser: Subject<User[]> = new Subject<User[]>();
      let loggedin = false;
      userByUser.subscribe(
        (all: User[]) => {
          if (!loggedin) {
            let filtered: User[] = all.filter((next: User) => {
              return next.username === username && next.password === encoded; } );
            if (filtered.length > 0) {
              this.firstLoad = true;
              this.booleanChain.next(true);
              loggedin = true;
              let sessionObj: any = {sessionKey: '' + this.sessionKey, user: filtered[0]};
              AuthService.session = new Session(sessionObj);
              let sessionResponseSubscribtion: any;
              /* tslint:disable */
              let responseSubject: Subject<boolean> = this.insertSession(sessionResponseSubscribtion, '' +
                AuthService.session.id, AuthService.session);
              /* tslint:enable */
              responseSubject.subscribe(
              (next: boolean) => {
                  if(next) {
                    localStorage.setItem(USER_SESSION_KEY, '' + this.sessionKey);
                  } else {
                    loggedin = false;
                    this.firstLoad = false;
                    if (!!this.booleanChain) {
                      this.booleanChain.next(false);
                    }
                    this.logout();
                  }
                  console.log('Session save success : ' + next);
                  if (!!sessionResponseSubscribtion) {
                    sessionResponseSubscribtion.unsubscribe();
                  }
                }
              );
            } else {
              loggedin = false;
              this.firstLoad = false;
              this.booleanChain.next(false);
              this.logout();
            }
          }
        },
        (err: any) => {
          this.booleanChain.next(false);
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
          }
          if (!loggedin) {
            this.booleanChain = null;
            this.logout();
          }
        },
        () => {
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
          }
          if (!loggedin) {
            this.booleanChain.next(false);
            this.logout();
          }
          this.booleanChain = null;
        }
      );
      let filter: Filter = new Filter(FILTER_TYPE.KEYVALUE, USERS_SERVICE_USERNAME_PARAMETER, username);
      let request: Request = Request.AsQuery(USERS_SERVICE, filter);
      this.subscription = this.backendService.requireServiceQuery<User>(userByUser, request,
                                                                  new CloneableCreator<User>(User) , 3000);
    }
    return this.booleanChain;
  }

  /*
    allRoles()
    Determines the number of roles in the stream
    @return Subject<Roles[]> A subscription for all roles
  */
  allRoles(): Subject<Role[]> {
      let roleChain = new Subject<Role[]>();
      let rolesSubscription: any;
      let roleSubscription: any = this.getRoles(rolesSubscription).subscribe(
        (all: Role[]) => {
          let roles: Role[] = [];
          all.forEach((next: Role) => roles.push(next.clone()) );
          roleChain.next(roles);
          if (!!roleSubscription) {
            roleSubscription.unsubscribe();
            roleSubscription = null;
          }
          if (!!rolesSubscription) {
            rolesSubscription.unsubscribe();
            rolesSubscription = null;
          }
          roleChain = null;
        },
        (err: any) => {
          let roles2: Role[] = [];
          roleChain.next(roles2);
          if (!!roleSubscription) {
            roleSubscription.unsubscribe();
            roleSubscription = null;
          }
          if (!!rolesSubscription) {
            rolesSubscription.unsubscribe();
            rolesSubscription = null;
          }
          roleChain = null;
        },
        () => {
          if (!!roleSubscription) {
            roleSubscription.unsubscribe();
            roleSubscription = null;
          }
          if (!!rolesSubscription) {
            rolesSubscription.unsubscribe();
            rolesSubscription = null;
          }
          roleChain = null;
        }
      );
    return roleChain;
  }

  /*
   allRoles()
   Determines the number of roles in the stream
   @return Subject<Roles[]> A subscription for all roles
   */
  allAuths(): Subject<Auth[]> {
    let authChain = new Subject<Auth[]>();
    let authsSubscription: any;
    let authSubscription: any = this.getAuths(authsSubscription).subscribe(
      (all: Auth[]) => {
        let auths: Auth[] = [];
        all.forEach((next: Auth) => {
          auths.push(next.clone());
        } );

        authChain.next(auths);
        if (!!authSubscription) {
          authSubscription.unsubscribe();
          authSubscription = null;
        }
        if (!!authsSubscription) {
          authsSubscription.unsubscribe();
          authsSubscription = null;
        }
        authChain = null;
      },
      (err: any) => {
        let auths2: Auth[] = [];
        authChain.next(auths2);
        if (!!authSubscription) {
          authSubscription.unsubscribe();
          authSubscription = null;
        }
        if (!!authsSubscription) {
          authsSubscription.unsubscribe();
          authsSubscription = null;
        }
        authChain = null;
      },
      () => {
        if (!!authSubscription) {
          authSubscription.unsubscribe();
          authSubscription = null;
        }
        if (!!authsSubscription) {
          authsSubscription.unsubscribe();
          authsSubscription = null;
        }
        authChain = null;
      }
    );
    return authChain;
  }

  /*
   allUsers()
   Determines the number of users in the stream
   @return Subject<Users[]> A subscription for all users
   */
  allUsers(): Subject<User[]> {
    if (!this.userChain1) {
      this.userChain1 = new Subject<User[]>();
      let subscriptionX: any = this.getUsers(this.subscription1).subscribe(
        (all: User[]) => {
          let users: User[] = [];
          all.forEach((next: User) => {
            users.push(next.clone());
          } );
          this.userChain1.next(users);
          if (this.subscription1) {
            this.subscription1.unsubscribe();
            this.subscription1 = null;
          }
          subscriptionX.unsubscribe();
          subscriptionX = null;
        },
        (err: any) => {
          let users2: User[] = [];
          this.userChain1.next(users2);
          if (this.subscription1) {
            this.subscription1.unsubscribe();
            this.subscription1 = null;
          }
          subscriptionX.unsubscribe();
          subscriptionX = null;
          if (!!this.userChain1) {
            this.userChain1.error(err);
          }
         },
        () => {
          if (!!this.userChain1) {
            this.userChain1.complete();
          }
          this.userChain1 = null;
        }
      );
    }
    return this.userChain1;
  }

  /*
   byRole()
   Determines the number of users in the stream
   @param role: number The role number to filter for ...
   @return Subject<Users[]> A subscription for all users by a specif role
   */
  byRole(role: string): Subject<User[]> {
    if (!this.userChain2) {
      this.userChain2 = new Subject<User[]>();
      let subscriptionX: any = this.getUsersByKey(this.subscription2, USERS_SERVICE_ROLE_PARAMETER, role).subscribe(
        (all: User[]) => {
          let users: User[] = [];
          all.forEach((next: User) => users.push(next.clone()) );
//          users = users.filter((user: User) => { return user.role === role } );
          this.userChain2.next(users);
          if (this.subscription2) {
            this.subscription2.unsubscribe();
            this.subscription2 = null;
          }
          subscriptionX.unsubscribe();
          subscriptionX = null;
          this.userChain2 = null;
        },
        (err: any) => {
          let users2: User[] = [];
          this.userChain2.next(users2);
          if (this.subscription2) {
            this.subscription2.unsubscribe();
            this.subscription2 = null;
          }
          subscriptionX.unsubscribe();
          subscriptionX = null;
          this.userChain2 = null;
        }
      );
    }
    return this.userChain2;
  }

  /*
   byUserName()
   Determines the number of users in the stream
   @param username: string The username number to filter for ...
   @return Subject<Users[]> A subscription for all users by a specif username
   */
  byUserName(username: string): Subject<User[]> {
    if (!this.userChain3) {
      this.userChain3 = new Subject<User[]>();
      let subscriptionX: any = this.getUsersByKey(this.subscription3, USERS_SERVICE_USERNAME_PARAMETER, username).subscribe(
        (all: User[]) => {
          let users: User[] = [];
          all.forEach((next: User) => users.push(next.clone()) );
//          users = users.filter((user: User) => { return user.username === username; } );
          this.userChain3.next(users);
          if (this.subscription3) {
            this.subscription3.unsubscribe();
            this.subscription3 = null;
          }
          subscriptionX.unsubscribe();
          subscriptionX = null;
          this.userChain3 = null;
        },
        (err: any) => {
          let users2: User[] = [];
          this.userChain3.next(users2);
          if (this.subscription3) {
            this.subscription3.unsubscribe();
            this.subscription3 = null;
          }
          subscriptionX.unsubscribe();
          subscriptionX = null;
          this.userChain3 = null;
        }
      );
    }
    return this.userChain3;
  }

  logout(): any {
    let sessionResponseSubscribtion: any;
    if (!!AuthService.session) {
      let responseSubject: Subject<boolean> = this.deleteSession(sessionResponseSubscribtion,
        localStorage.getItem(USER_SESSION_KEY));
      responseSubject.subscribe(
        (next: boolean) => {
          if (next) {
            localStorage.removeItem(USER_SESSION_KEY);
            this.firstLoad = false;
          }
          if (!!sessionResponseSubscribtion) {
            sessionResponseSubscribtion.unsubscribe();
          }
          AuthService.session = null;
        }
      );
    }
  }

  getUser(): User {
    return AuthService.session ? AuthService.session.user : null;
  }

  getUserId(): string {
    return this.getUser() ? AuthService.session.user.username : '';
  }

  getUserName(): string {
    return AuthService.session ?  AuthService.session.user.name() : '';
  }

  checkLogged(): void {
    if (!AuthService.session) {
      let sessionValue: string = localStorage.getItem(USER_SESSION_KEY);
      if (!!sessionValue) {
        let subscriber: any;
        this.loadSession(subscriber, sessionValue).subscribe(
          (all: Session[]) => {
            if (all.length > 0) {
              AuthService.session = all[0].clone();
              this.firstLoad = true;
            } else {
              this.firstLoad = false;
            }
          },
          (err: any) => {
            this.firstLoad = false;
            console.log('Session not loaded - error : ' + err);
          },
          () => {
            this.firstLoad = false;
          }
        );
      }
    }
  }

  isLogged(): boolean {
    return this.getUser() !== null || (this.firstLoad && localStorage.getItem(USER_SESSION_KEY) !== null);
  }
}
