import {Http, Response, Headers, RequestOptionsArgs} from '@angular/http';
import {Injectable, Inject} from '@angular/core';
import { SESSION_KEY } from '../utils/utils';
import {Observable, Subject, Subscriber} from 'rxjs';
import {User, Role, Auth} from '../models/login-models';
import {Contact, Item} from '../models/address-book-models';
import {OBJECT_SERVICE_SERVER_CONF} from '../shared/constants';
import {ServiceServer} from '../shared/app-env.interface';
import { Request, FILTER_TYPE, REQUEST_TYPE } from '../models/back-end-model';
import { Cloneable, Factory, CloneableCreator } from '../models/base-model';

declare const JSON: any;

@Injectable()
export class BackEndService {

  /**
   * Represent the Back-End Service
   * @constructor
   * @param {string} sessionKey - the current session key
   * @param {ServiceServer} serviceConfig - The Service Serer configuration
   * @param {Http} http - the Http service
   *
   */
  constructor(@Inject(SESSION_KEY) public sessionKey: string,
              @Inject(OBJECT_SERVICE_SERVER_CONF) public serviceConfig: ServiceServer,
              private http: Http) {
  }

  /**
   * requireServiceDML() - method that realize the dml command statement.
   * @param {Subject<boolean>} expectedSubject - subscriber of the response status
   * @param {Request} request - request class of the element
   * @param {number} timeout(optional) - timeout for the XHR request elaboration
   *
   */
  requireServiceDML(expectedSubject: Subject<boolean>, request: Request, timeout?: number): Subscriber<Response> {
    /* tslint:disable */
    let completed: boolean = false;
    /* tslint:enable */
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    if (!!timeout) {
      if (request.requestType === REQUEST_TYPE.INSERT) {

        let config: RequestOptionsArgs = {
          url: this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service,
          method: 'POST',
          headers: headers
        };
        return <Subscriber<Response>> this.http.post(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service, JSON.stringify(request.item), config)
          .timeout(timeout)
          .subscribe( (response: Response) => {
              completed = response.ok;
              expectedSubject.next(completed);
            },
            (err: any) => expectedSubject.next(false),
            () => expectedSubject.next(completed)
          );
      } else if (request.requestType === REQUEST_TYPE.UPDATE) {
        let config: RequestOptionsArgs = {
          url: this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service + '/' + request.itemId,
          method: 'PUT',
          headers: headers
        };
        return <Subscriber<Response>> this.http.put(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service + '/' + request.itemId, JSON.stringify(request.item), config)
          .timeout(timeout)
          .subscribe( (response: Response) => {
              completed = response.ok;
              expectedSubject.next(completed);
            },
            (err: any) => expectedSubject.next(false),
            () => expectedSubject.next(completed)
          );
      } else  if (request.requestType === REQUEST_TYPE.DELETE) {
        return <Subscriber<Response>> this.http.delete(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service + '/' + request.itemId)
          .timeout(timeout)
          .subscribe( (response: Response) => {
              completed = response.ok;
              expectedSubject.next(completed);
            },
            (err: any) => expectedSubject.next(false),
            () => expectedSubject.next(completed)
          );
      }
    } else {
      if (request.requestType === REQUEST_TYPE.INSERT) {
        let config: RequestOptionsArgs = {
          url: this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service ,
          method: 'POST',
          headers: headers
        };
        return <Subscriber<Response>> this.http.post(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service, JSON.stringify(request.item), config)
          .subscribe( (response: Response) => {
              completed = response.ok;
              expectedSubject.next(completed);
            },
            (err: any) => expectedSubject.next(false),
            () => expectedSubject.next(completed)
          );
      } else if (request.requestType === REQUEST_TYPE.UPDATE) {
        let config: RequestOptionsArgs = {
          url: this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service + '/' + request.itemId,
          method: 'PUT',
          headers: headers
        };
        return <Subscriber<Response>> this.http.put(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service + '/' + request.itemId, JSON.stringify(request.item), config)
          .subscribe( (response: Response) => {
              completed = response.ok;
              expectedSubject.next(completed);
            },
            (err: any) => expectedSubject.next(false),
            () => expectedSubject.next(completed)
          );
      } else  if (request.requestType === REQUEST_TYPE.DELETE) {
        return <Subscriber<Response>> this.http.delete(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
          ':' + this.serviceConfig.port + '/' + request.service + '/' + request.itemId)
          .subscribe( (response: Response) => {
              completed = response.ok;
              expectedSubject.next(completed);
            },
            (err: any) => expectedSubject.next(false),
            () => expectedSubject.next(completed)
          );
      }
    }
    return null;
  }

  /**
  * requireServiceQuery() - template method that realize the query statement.
  * @param {Subject<A[]>} expectedSubject - subscriber of the discovered template elements
  * @param {Request} request - request class of the element
  * @param {number} timeout (optional) - timeout for the accumulation or nothing (or zero) if not provided
  */
  /* tslint:disable */
  requireServiceQuery<A extends Cloneable>(expectedSubject: Subject<A[]>, request: Request, creator: CloneableCreator<A>, timeout?: number): Subscriber<Response> {
    /* tslint:enable */
    if (request.requestType !== REQUEST_TYPE.QUERY && request.requestType !== REQUEST_TYPE.FULL) {
      return null;
    }
    let searchKey: string;
    let searchValue: any;
    let searchText: string;
    /* tslint:disable */
    let qryOptions: string = '';
    let qrySortOptions: string = '';
    /* tslint:enable */

    if (request.requestType === REQUEST_TYPE.QUERY) {
      if (!!request.filter) {
        switch (request.filter.type) {
          case FILTER_TYPE.KEYVALUE:
            searchKey  = request.filter.searchKey;
            searchValue  = request.filter.searchValue;
            break;
          case FILTER_TYPE.LIKE:
            searchKey  = request.filter.searchKey + '_like';
            searchValue  = request.filter.searchValue;
            break;
          case FILTER_TYPE.FULL_TEXT:
            searchText = request.filter.fullText;
            break;
          case FILTER_TYPE.LESSTHANEQ:
            searchKey  = request.filter.searchKey + '_lte';
            searchValue  = request.filter.searchValue;
            break;
          case FILTER_TYPE.GREATERTHANEQ:
            searchKey  = request.filter.searchKey + '_gte';
            searchValue  = request.filter.searchValue;
            break;
          default:
            break;
        }
      }
      if (!!request.paging) {
        let pageQuery: string = (!!searchKey || !!searchText ? '&' : '?');
        if (!!request.paging.page) {
          pageQuery += '_page=' + request.paging.page + (!!request.paging.size ? '&' : '');
        }
        if (!!request.paging.size) {
          pageQuery += '_limit=' + request.paging.size;
        }
        if ( pageQuery.length > 2 ) {
          qryOptions = pageQuery;
        }
      }
      if (!!request.sorter) {
        let sortQuery: string = (!!searchKey || !!searchText || qryOptions.length ? '&' : '?');
        if (!!request.sorter.key) {
          sortQuery += '_sort=' + request.sorter.key + '&_order=' + ( request.sorter.ascending ? 'ASC' : 'DESC' );
        }
        if ( sortQuery.length > 2 ) {
          qrySortOptions = sortQuery;
        }
      }
    }
    if (!!timeout) {
      return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
        ':' + this.serviceConfig.port + '/' + request.service + (!!searchKey ?  '?' + searchKey +
            '=' + (!!searchValue ? searchValue : '') : '') + (!!searchText ? '?q=' + searchText : '') + qryOptions + qrySortOptions)
        .timeout(timeout)
        .subscribe( (response: Response) => {
            let respValue: any[] = response.json();
            let allValues: A[] = [];
            respValue.forEach((next: any) => allValues.push(Factory.newCloneable<A>(next, creator)));
            expectedSubject.next(allValues);
          },
          (err: any) => expectedSubject.error(err),
          () => expectedSubject.complete()
        );
    } else {
      return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
        ':' + this.serviceConfig.port + '/' + request.service + (!!searchKey ?  '?' + searchKey +
        '=' + (!!searchValue ? searchValue : '') : '') + (!!searchText ? '?q=' + searchText : '') + qryOptions + qrySortOptions)
        .subscribe( (response: Response) => {
            let respValue: any[] = response.json();
            let allValues: A[] = [];
            respValue.forEach((next: any) => allValues.push(Factory.newCloneable<A>(next, creator)));
            expectedSubject.next(allValues);
          },
          (err: any) => expectedSubject.error(err),
          () => expectedSubject.complete()
        );
    }
  }


  getEntireKeysObserver(): Observable<Response> {
    return this.http.get('http://' + this.serviceConfig.host + this.serviceConfig.port + '/db');
  }

  requireUsers(expectedSubject: Subject<User[]>, timeout?: number): Subscriber<Response> {
    if (!!timeout) {
      return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
        ':' + this.serviceConfig.port + '/users')
        .timeout(timeout)
        .subscribe( (response: Response) => {
            let respValue: any[] = response.json();
            let allValues: User[] = [];
            respValue.forEach((value: any) => allValues.push(new User(value)));
            expectedSubject.next(allValues);
        },
        (err: any) => expectedSubject.error(err),
        () => expectedSubject.complete()
        );
    } else {
      return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
        ':' + this.serviceConfig.port + '/users')
        .subscribe( (response: Response) => {
          let respValue: any[] = response.json();
          let allValues: User[] = [];
          respValue.forEach((value: any) => allValues.push(new User(value)));
          expectedSubject.next(allValues);
        },
        (err: any) => expectedSubject.error(err),
        () => expectedSubject.complete()
        );
    }
  }
  requireRoles(expectedSubject: Subject<Role[]>): Subscriber<Response> {
    return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
      ':' + this.serviceConfig.port + '/roles')
      .subscribe( (response: Response) => {
        let respValue: any[] = response.json();
        let allValues: Role[] = [];
        respValue.forEach((value: any) => allValues.push(new Role(value)));
        expectedSubject.next(allValues);
      },
      (err: any) => expectedSubject.error(err),
      () => expectedSubject.complete()
      );
  }

  requireAuthorizationTypes(expectedSubject: Subject<Auth[]>): Subscriber<Response> {
    return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
      ':' + this.serviceConfig.port + '/auths')
      .subscribe( (response: Response) => {
        let respValue: any[] = response.json();
        let allValues: Auth[] = [];
        respValue.forEach((value: any) => allValues.push(new Auth(value)));
        expectedSubject.next(allValues);
      },
      (err: any) => expectedSubject.error(err),
      () => expectedSubject.complete()
      );
  }

  requireAddressBook(expectedSubject: Subject<Contact[]>): Subscriber<Response> {
    return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
      ':' + this.serviceConfig.port + '/people')
      .subscribe( (response: Response) => {
        let respValue: any[] = response.json();
        let allValues: Contact[] = [];
        respValue.forEach((value: any) => allValues.push(new Contact(value)));
        expectedSubject.next(allValues);
      },
      (err: any) => expectedSubject.error(err),
      () => expectedSubject.complete()
      );
  }

  requireABContactTypes(expectedSubject: Subject<Item[]>): Subscriber<Response> {
    return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
      ':' + this.serviceConfig.port + '/contacts')
      .subscribe( (response: Response) => {
        let respValue: any[] = response.json();
        let allValues: Item[] = [];
        respValue.forEach((value: any) => allValues.push(new Item(value)));
        expectedSubject.next(allValues);
      },
      (err: any) => expectedSubject.error(err),
      () => expectedSubject.complete()
      );
  }

  requireCountries(expectedSubject: Subject<Item[]>): Subscriber<Response> {
    return <Subscriber<Response>> this.http.get(this.serviceConfig.protocol + '://' + this.serviceConfig.host +
      ':' + this.serviceConfig.port + '/countries')
      .subscribe( (response: Response) => {
        let respValue: any[] = response.json();
        let allValues: Item[] = [];
        respValue.forEach((value: any) => allValues.push(new Item(value)));
        expectedSubject.next(allValues);
      },
      (err: any) => expectedSubject.error(err),
      () => expectedSubject.complete()
      );
  }

}
