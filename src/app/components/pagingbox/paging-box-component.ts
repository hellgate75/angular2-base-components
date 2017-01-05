import {Component, ElementRef, AfterContentInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { Pager } from '../../models/back-end-model';

declare var jQuery: any;

/* tslint:disable */
@Component({
  selector: 'paging-box',
  providers: [  ],
  templateUrl: './paging-box-component.html',
  styleUrls: ['./paging-box-component.scss'],
  host: {'style' : 'width: 100%'}
})
/* tslint:enable */
export class PagingBoxComponent implements AfterContentInit {
  /* tslint:disable */
  @Output() paging: EventEmitter<Pager>;
  @Input() pageSize: number;
  @Input() itemSize: number;
  @Input() pageSizeChangeEvent: EventEmitter<number>;
  /* tslint:enable */
  pager: Pager = Pager.empty(4);

  maxPageSize(): number {
    return (!!this.itemSize && !!this.pageSize ? (this.itemSize  / this.pageSize ) : 1);
  }

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
    this.paging = new EventEmitter<Pager>();
  }

  toFirstPage(): void {
    this.pager.page = 1;
    this.paging.emit(this.pager);
    this.scrollToBar();
  }

  previousPage(): void {
    this.pager.prev();
    this.paging.emit(this.pager.clone());
    this.scrollToBar();
  }

  nextPage(): void {
    this.pager.next();
    this.paging.emit(this.pager.clone());
    this.scrollToBar();
  }

  toLastPage(): void {
    this.pager.page = this.maxPageSize();
    this.paging.emit(this.pager.clone());
    this.scrollToBar();
  }

  scrollToBar(): void {
    let offset: number = parseInt(jQuery(this.elementRef.nativeElement).offset() ? jQuery(this.elementRef.nativeElement).offset().top : '0', 10);
    jQuery('html, body').animate({
      scrollTop: offset
    }, 2500);  }

  ngAfterContentInit(): void {
    this.pager = Pager.empty(this.pageSize);
  }

}
