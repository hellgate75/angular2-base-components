import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { AddressBookService } from '../../services/address-book-service';
import { Contact, Item } from '../../models/address-book-models';
import { FilterBoxComponent } from '../filterbox/filter-box-component';
import { Subject } from 'rxjs';



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

  constructor() {
  }

  ngOnInit(): void {
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
  providers: [AddressBookService, AddressBookTableComponent, FilterBoxComponent],
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
  constructor(private addressBookService: AddressBookService) {
  }

  start(event: boolean): void {
   }

  search(event: string): void {
    this.reload(event);
  }

  ngOnInit(): void {
    this.isLoading = true;
    if (AddressBookComponent.filterText !== '') {
      this.reload(AddressBookComponent.filterText);
    } else {
      this.addressBookService.getContacts().subscribe(
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
    this.addressBookService.getContactsByFullText(filter).subscribe(
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
