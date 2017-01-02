import {Injectable, Inject} from '@angular/core';
import {Contact, Item} from '../models/address-book-models';
import { Request, Filter, FILTER_TYPE } from '../models/back-end-model';
import { CloneableCreator } from '../models/base-model';
import {Subject} from 'rxjs';
import { BackEndService } from './back-end-service';
import { CONTACTS_SERVICE, CONTACT_TYPES_SERVICE, COUNTRIES_SERVICE } from '../shared/constants';

@Injectable()
export class AddressBookService {

    constructor(@Inject(BackEndService) public backendService: BackEndService) {
    }

  getContacts(): Subject<Contact[]> {
    let create: Subject<Contact[]> = new Subject<Contact[]>();
    let request: Request = Request.AsFullItemList(CONTACTS_SERVICE);
    this.backendService.requireServiceQuery<Contact>(create, request, new CloneableCreator(Contact));
    return create;
  }

  getContactsByFullText(text: string): Subject<Contact[]> {
    if (!text || !text.length) {
      return this.getContacts();
    } else {
      let create: Subject<Contact[]> = new Subject<Contact[]>();
      let filter: Filter = new Filter(FILTER_TYPE.FULL_TEXT);
      filter.fullText = text;
      let request: Request = Request.AsQuery(CONTACTS_SERVICE, filter);
      this.backendService.requireServiceQuery<Contact>(create, request, new CloneableCreator(Contact));
      return create;
    }
  }

  getContactTypes(): Subject<Item[]> {
      let create: Subject<Item[]> = new Subject<Item[]>();
      let request: Request = Request.AsFullItemList(CONTACT_TYPES_SERVICE);
      this.backendService.requireServiceQuery<Item>(create, request, new CloneableCreator(Item));
      return create;
    }

    getCountries(): Subject<Item[]> {
      let create: Subject<Item[]> = new Subject<Item[]>();
      let request: Request = Request.AsFullItemList(COUNTRIES_SERVICE);
      this.backendService.requireServiceQuery<Item>(create, request, new CloneableCreator(Item));
      return create;
    }

}
