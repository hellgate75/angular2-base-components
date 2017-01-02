import {Component, ElementRef, AfterContentInit,  Inject, EventEmitter, Output, Input } from '@angular/core';

import { SortingItem, SORTING_STATE } from '../../models/back-end-model';

declare var jQuery: any;



/* tslint:disable */
@Component({
  selector: 'sorting-box-item',
  providers: [ ],
  templateUrl: './sorting-box-item-component.html',
  styleUrls: ['./sorting-box-component.scss'],
  host: {'style' : 'width: 100%'}
})
/* tslint:enable */
export class SortingBoxItemComponent {
  @Output() sorting: EventEmitter<SortingItem>;
  @Input() item: SortingItem;

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
    this.sorting = new EventEmitter<SortingItem>();
  }

  toggle(): void {
    if (!!this.item) {
      this.item.toggle();
    }
    this.sorting.emit(this.item);
  }


  descr(): string {
    if (!!this.item) {
      return this.item.description;
    }
    return '';
  }

   state(): string {
    if (!!this.item) {
      switch (this.item.state) {
        case SORTING_STATE.DESCENDING:
          return 'desc';
        case SORTING_STATE.ASCENDING:
          return 'asc';
        default:
          return '';
      }
    }
    return '';
  }

}


/* tslint:disable */
@Component({
  selector: 'sorting-box',
  providers: [ SortingBoxItemComponent ],
  templateUrl: './sorting-box-component.html',
  styleUrls: ['./sorting-box-component.scss'],
  host: {'style' : 'width: 100%'}
})
/* tslint:enable */
export class SortingBoxComponent implements AfterContentInit {
  @Input() items: SortingItem[];
  @Input() selected: SortingItem;
  @Output() sorted: EventEmitter<SortingItem>;
  /* tslint:enable */

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
    if (this.items === null) {
      this.items = [];
    }
    this.sorted = new EventEmitter<SortingItem>();
  }

  ngAfterContentInit(): void {
    if (!!this.selected) {
      let sorted: SortingItem = this.items.filter( (next: SortingItem) => { return next.key === this.selected.key; } )[0];
      if (!!sorted) {
        sorted.state = this.selected.state;
        this.selected = sorted;
        this.sorting(sorted);
      }
    }
  }

  sorting(selection: SortingItem): void {
    let unsorted: SortingItem[] = this.items.filter( (next: SortingItem) => { return next.key !== selection.key; } );
    unsorted.forEach( (next: SortingItem) => { return next.reset(); } );
    this.sorted.emit(selection);
  }
}
