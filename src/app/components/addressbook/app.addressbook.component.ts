import { Component, OnInit, Input, Output, Inject, EventEmitter } from '@angular/core';
import { AddressBookService } from '../../services/address-book-service';
import { Contact, Item } from '../../models/address-book-models';
import { FilterBoxComponent } from '../filterbox/filter-box-component';
import { SortingBoxComponent } from '../sortingbox/sorting-box-component';
import { SortingItem, SORTING_STATE, Sorter } from '../../models/back-end-model';
import { Cloneable } from '../../models/base-model';
import { CONTACTS_SERVICE_META_KEY } from '../../shared/constants';
import { EditDialogComponent } from '../editcomponent/edit-dialog-component';
import { Subject } from 'rxjs'


@Component({
  selector: 'app-address-book-table',
  providers: [],
  templateUrl: './app.addressbook.table.component.html',
  styleUrls: ['./app.addressbook.component.scss']
})
export class AddressBookTableComponent implements OnInit {
  @Input() contacts: Contact[];
  @Input() types: Item[];
  @Input() countries: Item[];
  @Output() update: EventEmitter<Contact>;
  @Output() delete: EventEmitter<Contact>;

  constructor() {
    this.update = new EventEmitter<Contact>();
    this.delete = new EventEmitter<Contact>();
  }

  ngOnInit(): void {
  }
  deleteContact(contactId: string): void {
    let contact: Contact = this.contacts.filter( (item: Contact) => { return item.id === contactId; } )[0];
    this.delete.emit(contact);
  }
  updateContact(contactId: string): void {
    let contact: Contact = this.contacts.filter( (item: Contact) => { return item.id === contactId; } )[0];
    this.update.emit(contact);
  }
  translateCountry(code: string): string {
    let selectedCountry: Item = this.countries ? (this.countries.filter((curr: Item) => { if (curr.type === code) {
      return curr;
    } })[0] || null) : null;
    return selectedCountry ? selectedCountry.value : '<undefined>';
  }
  getCountry(countryValue: string, countries: Item[]): Item {
    return countries ? countries.filter( (country: Item) => { if (country.type === countryValue) {
      return country;
    } })[0] || null : null;
  }
  getContactDesc(contactType: string): string {
    let selectedContact: Item = this.types ? (this.types.filter( (contact: Item) => { if (contact.type === contactType) {
      return contact;
    } })[0] || null) : null;
    return selectedContact ? selectedContact.value : '<undefined>';
  }
}

@Component({
  selector: 'app-address-book',
  providers: [AddressBookService, AddressBookTableComponent, FilterBoxComponent,
              SortingBoxComponent, EditDialogComponent],
  templateUrl: './app.addressbook.component.html',
  styleUrls: ['./app.addressbook.component.scss']
})
export class AddressBookComponent implements OnInit {
  title: string = 'Address Book';
  description: string = 'Here you can manage your address book list...';
  contacts: Contact[] = [];
  contactTypes: Item[] = [];
  countries: Item[] = [];
  /* tslint:disable */
  static filterText: string = '';
  /* tslint:enable */
  change: string = AddressBookComponent.filterText;
  isError: boolean = false;
  isLoading: boolean = false;
  /* tslint:disable */
  static selectedItem: SortingItem = null;
  /* tslint:enable */
  currentItem: SortingItem = AddressBookComponent.selectedItem;
  sortingItems: SortingItem[] = [];
  sorter: Sorter;
  metaValues: any = {};
  dialogActivation: EventEmitter<Cloneable>;

  constructor(private addressBookService: AddressBookService,
              @Inject(CONTACTS_SERVICE_META_KEY) private contactsMeta: any) {
    this.contactsMeta.sorting.forEach((sortItem: any) => {
      this.sortingItems.push (new SortingItem(sortItem.id, sortItem.name, sortItem.sort));
    });
    this.metaValues = {
      'contacts': this.contactTypes,
      'countries': this.countries
    };
    this.dialogActivation = new EventEmitter<Cloneable>();
  }

  contactChanged(event: Cloneable): void {
    if (!!event) {
      let selectedContact: Contact = this.contacts.filter((next: Contact) => {
        return next.id === event.id;
      })[0];
      if (!!selectedContact) {
        let selectedContactBackup: Contact = selectedContact.clone();
        selectedContact.reverse(event);

        let response: Subject<boolean> = this.addressBookService.updateContact(selectedContact);
        response.subscribe(
          (next: boolean) => {
            if (!!next) {
              this.successXHR('update');
            } else {
              this.unsuccessXHR('update');
              selectedContact = selectedContactBackup;
            }
          },
          (err: any) => {
            this.unsuccessXHR('update');
            selectedContact = selectedContactBackup;
          }
        );
      } else {
        let response: Subject<boolean> = this.addressBookService.addContact(event);
        response.subscribe(
          (next: boolean) => {
            if (!!next) {
              this.contacts.push((<Contact>event).clone());
              this.successXHR('insert');
            } else {
              this.unsuccessXHR('insert');
            }
          },
          (err: any) => {
            this.unsuccessXHR('insert');
          }
        );
      }
    }
  }

  successXHR(type: string): void {
    // Here code to show message
    console.log(type + ' successful ...');
  }

  unsuccessXHR(type: string): void {
    // Here code to show message
    console.log(type + ' failed ...');
  }

  deleteContact(contact: Contact): void {
    if (!!event) {
      let selectedContact: Contact = this.contacts.filter((next: Contact) => {
        return next.id === contact.id;
      })[0];
      if (!!selectedContact) {
        let response: Subject<boolean> = this.addressBookService.deleteContact(selectedContact);
        response.subscribe(
          (next: boolean) => {
            if (!!next) {
              let contactIndex: number = this.contacts.indexOf(selectedContact);
              if (contactIndex >= 0) {
                this.contacts.splice(contactIndex, 1);
              }
              this.successXHR('delete');
            } else {
              this.unsuccessXHR('delete');
            }
          },
          (err: any) => {
            this.unsuccessXHR('delete');
          }
        );
      }
    }
  }

  addContact(): void {
    let contact: Contact = Contact.empty();
    this.updateContact(contact);
  }

  updateContact(contact: Contact): void {
    this.dialogActivation.emit(contact);
  }

  start(event: boolean): void {
  }

  search(event: string): void {
    this.reload(event);
  }

  sorted(selectedItem: SortingItem): void {
    AddressBookComponent.selectedItem =
      (!selectedItem || selectedItem.state === SORTING_STATE.NONE ? null : selectedItem);
    // TODO: apply or remove sorting ....
    this.evaluateSorting();
    this.reload(AddressBookComponent.filterText);
  }

  evaluateSorting(): void {
    if (!!AddressBookComponent.selectedItem && AddressBookComponent.selectedItem.state !== SORTING_STATE.NONE) {
      this.sorter = new Sorter(AddressBookComponent.selectedItem.key, AddressBookComponent.selectedItem.state === SORTING_STATE.ASCENDING);
    } else {
      this.sorter = null;
    }
  }

  ngOnInit(): void {
    this.evaluateSorting();
    this.isLoading = true;
    if (AddressBookComponent.filterText !== '') {
      this.reload(AddressBookComponent.filterText);
    } else {
      this.addressBookService.getContacts(this.sorter).subscribe(
        (all: Contact[]) => {
          all.forEach((contact: Contact) => {
            this.contacts.push(new Contact(contact));
          });
          this.isError = false;
        },
        (err: any) => {
          setTimeout(() => {
            this.isError = true;
            this.isLoading = false;
          }, 500);
        },
        () => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      );
    }
    this.addressBookService.getContactTypes().subscribe(
      (all: Item[]) => all.forEach((type: Item) => this.contactTypes.push(new Item(type)))
    );
    this.addressBookService.getCountries().subscribe(
      (all: Item[]) => all.forEach((type: Item) => this.countries.push(new Item(type)))
    );
  }

  reload(filter: string): void {
    this.isLoading = true;
    AddressBookComponent.filterText = filter || '';
    this.addressBookService.getContactsByFullText(filter, this.sorter).subscribe(
      (all: Contact[]) => {
        this.contacts.splice(0, this.contacts.length);
        all.forEach((contact: Contact) => {
          this.contacts.push(new Contact(contact));
        });
        this.isError = false;
      },
      (err: any) => {
        setTimeout(() => {
          this.isError = true;
          this.isLoading = false;
        }, 500);
      },
      () => {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    );
  }
}
