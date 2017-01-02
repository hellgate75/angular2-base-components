import { uuid } from '../utils/uuid';
import { Cloneable } from './base-model';

export class Item implements Cloneable {
  id: string;
  type: string;
  value: string;
  constructor(object: any) {
    this.id = object.id        || uuid();
    this.type = object.type    || '';
    this.value = object.value  || '';
  }
  toString(): string {
    return '{id: "' + this.id + '", type: "' + this.type + '", value: "' + this.value + '"}';
  }
  clone(): Item {
    return new Item(this);
  }
}

export class ContactType implements Cloneable {
  id: string;
  type: string;
  value: string;
  constructor(object: any) {
    this.id = object.id            || uuid();
    this.type = object.type        || '';
    this.value = object.value      || '';
  }
  toString(): string {
    return '{type: "' + this.type + '", value: "' + this.value + '"}';
  }
  clone(): ContactType {
    return new ContactType(this);
  }
}

export class Contact implements Cloneable {
  id: string;
  firstname: string;
  surname: string;
  address: string;
  city: string;
  county: string;
  country: string;
  contacts: ContactType[];
  constructor(object: any) {
    this.id = object.id                    || uuid();
    this.firstname = object.firstname      || '';
    this.surname = object.surname          || '';
    this.address = object.address          || '';
    this.city = object.city                || '';
    this.county = object.county            || '';
    this.country = object.country          || 'IT';
    this.contacts = object.contacts ? object.contacts.map((current: any) => { return new ContactType(current); } ) : []  || [];
  }
  getName(): string {
    return this.surname + ' ' + this.firstname;
  }
  clone(): Contact {
    return new Contact(this);
  }
}
