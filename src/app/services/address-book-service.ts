import {Injectable, Inject} from '@angular/core';
import {Contact, Item} from '../models/address-book-models';
import {Request, Filter, FILTER_TYPE, Sorter, Pager} from '../models/back-end-model';
import {CloneableCreator, Cloneable} from '../models/base-model';
import {Subject} from 'rxjs';
import { BackEndService } from './back-end-service';
import { CONTACTS_SERVICE, CONTACT_TYPES_SERVICE, COUNTRIES_SERVICE } from '../shared/constants';

@Injectable()
export class AddressBookService {

    constructor(@Inject(BackEndService) public backendService: BackEndService) {
    }

  getContacts(sortRule?: Sorter, pager?: Pager): Subject<Contact[]> {
    let create: Subject<Contact[]> = new Subject<Contact[]>();
    let request: Request = Request.AsFullItemList(CONTACTS_SERVICE, sortRule, pager);
    this.backendService.requireServiceQuery<Contact>(create, request, new CloneableCreator(Contact));
    return create;
  }

  getContactSize(): Subject<number> {
    let notifier: Subject<number> = new Subject<number>();
    let create: Subject<Contact[]> = new Subject<Contact[]>();
    let request: Request = Request.AsFullItemList(CONTACTS_SERVICE);
    this.backendService.requireServiceQuery<Contact>(create, request, new CloneableCreator(Contact));
    create.subscribe(
      (all: Contact[]) => {
        notifier.next(all.length);
      },
      (err: any) => {
        notifier.next(0);
      }
    )
    return notifier;
  }

  addContact(contact: Cloneable): Subject<boolean> {
    let create: Subject<boolean> = new Subject<boolean>();
    let request: Request = Request.AsInsert(CONTACTS_SERVICE, contact.id, contact);
    this.backendService.requireServiceDML(create, request);
    return create;
  }

  updateContact(contact: Cloneable): Subject<boolean> {
    let create: Subject<boolean> = new Subject<boolean>();
    let request: Request = Request.AsUpdate(CONTACTS_SERVICE, contact.id, contact);
    this.backendService.requireServiceDML(create, request);
    return create;
  }

  deleteContact(contact: Cloneable): Subject<boolean> {
    let create: Subject<boolean> = new Subject<boolean>();
    let request: Request = Request.AsDelete(CONTACTS_SERVICE, contact.id);
    this.backendService.requireServiceDML(create, request);
    return create;
  }

  getContactsByFullText(text: string, sortRule?: Sorter, pager?: Pager): Subject<Contact[]> {
    if (!text || !text.length) {
      return this.getContacts(sortRule, pager);
    } else {
      let create: Subject<Contact[]> = new Subject<Contact[]>();
      let filter: Filter = new Filter(FILTER_TYPE.FULL_TEXT);
      filter.fullText = text;
      let request: Request = Request.AsQuery(CONTACTS_SERVICE, filter, sortRule, pager);
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
