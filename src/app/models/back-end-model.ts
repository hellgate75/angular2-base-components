import { Cloneable } from './base-model';

export enum SORTING_STATE {NONE, ASCENDING, DESCENDING};

export class SortingItem {
  key: string;
  description: string;
  state: SORTING_STATE;
  cortocircuit: boolean;

  constructor(key: string, description: string, state?: SORTING_STATE, cortocircuit?: boolean) {
    this.key = key          || '';
    this.description = description  || '';
    this.state = state      || SORTING_STATE.NONE;
    this.cortocircuit = cortocircuit    || false;
  }

  toggle(): void {
    if (!this.cortocircuit) {
      switch (this.state) {
        case SORTING_STATE.ASCENDING:
          this.state = SORTING_STATE.NONE;
          break;
        case SORTING_STATE.DESCENDING:
          this.state = SORTING_STATE.ASCENDING;
          break;
        default:
          this.state = SORTING_STATE.DESCENDING;
      }
    } else {
      switch (this.state) {
        case SORTING_STATE.ASCENDING:
          this.state = SORTING_STATE.DESCENDING;
          break;
        case SORTING_STATE.DESCENDING:
          this.state = SORTING_STATE.ASCENDING;
          break;
        default:
          this.state = SORTING_STATE.ASCENDING;
      }
    }
  }
  reset(): void {
    this.state = SORTING_STATE.NONE;
  }

  clone(): SortingItem {
    return new SortingItem(this.key, this.description, this.state, this.cortocircuit);
  }
}

export enum REQUEST_TYPE {FULL, QUERY, INSERT, UPDATE, DELETE};

export enum FILTER_TYPE {KEYVALUE, LIKE, LESSTHANEQ, GREATERTHANEQ, NOT_EQUALS, FULL_TEXT};

export class Pager {
  page: number = 1;
  size: number = 4;

  constructor(size: number, page?: number) {
    if (!!size) {
      this.size = size;
    }
    if (!!page) {
      this.page = page;
    }
  }

  current(): number {
    return this.page;
  }

  limit(limit?: number): number {
    if (undefined !== limit) {
      if (!!limit) {
        this.size = limit;
      } else {
        this.size = 0;
      }
    }
    return this.size;
  }

  next(): void {
    this.page ++;
  }

  prev(): void {
    this.page --;
    if (this.page < 1) {
      this.page = 1;
    }
  }

  clone(): Pager {
    return new Pager(this.size, this.page);
  }

  update(element: any): void {
    if (!!element) {
      if (!!element.size) {
        this.size = element.size;
      }
      if (!!element.page) {
        this.page = element.page;
      }
    }
  }

  /* tslint:disable */
  static empty(size: number): Pager {
    return new Pager(size);
  }
  /* tslint: enble */
}

export class Sorter {
  key: string;
  ascending: boolean;
  constructor(key: string, ascending?: boolean) {
    this.key = key || '';
    this.ascending = ascending || false;
  }
}



export class Filter {
  type: FILTER_TYPE;
  searchKey: string;
  searchValue: any;
  fullText: string;
  constructor(type: FILTER_TYPE,  key?: string, value?: any, text?: string) {
    this.type = type;
    this.searchKey = key || '';
    this.searchValue = value || '';
    this.fullText = text || '';
  }
}

export class Request {
  service: string;
  requestType: REQUEST_TYPE;
  filter: Filter;
  sorter: Sorter;
  paging: Pager;
  itemId: string;
  item: Cloneable;

  constructor(service: string, requestType: REQUEST_TYPE) {
    this.service = service;
    this.requestType = requestType;
  }

  /* tslint:disable */
  static AsFullItemList(service: string, sorter?: Sorter, paging?: Pager): Request {
    let request: Request = new Request(service, REQUEST_TYPE.FULL);
    request.sorter = sorter || null;
    request.paging = paging || null;
    return request;
  }

  static AsQuery(service: string, filter: Filter, sorter?: Sorter, paging?: Pager): Request {
    let request: Request = new Request(service, REQUEST_TYPE.QUERY);
    request.filter = filter || null;
    request.paging = paging || null;
    request.sorter = sorter || null;
    return request;
  }

  static AsInsert(service: string, itemId: string, item: Cloneable): Request {
    let request: Request = new Request(service, REQUEST_TYPE.INSERT);
    request.itemId = itemId || null;
    request.item = item || null;
    return request;
  }

  static AsUpdate(service: string, itemId: string, item: Cloneable): Request {
    let request: Request = new Request(service, REQUEST_TYPE.UPDATE);
    request.itemId = itemId || null;
    request.item = item || null;
    return request;
  }

  static AsDelete(service: string, itemId: string): Request {
    let request: Request = new Request(service, REQUEST_TYPE.DELETE);
    request.itemId = itemId || null;
    return request;
  }
  /* tslint:enable */
}
