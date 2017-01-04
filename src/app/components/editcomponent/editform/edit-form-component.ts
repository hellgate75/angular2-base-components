import {Component, ElementRef, AfterContentInit, Inject, Input } from '@angular/core';
import { EditElementComponent } from '../formelement/form-element-component';
import { Cloneable, ItemChange } from '../edit-dialog-component';

declare var jQuery: any;

/* tslint:disable */
@Component({
  selector: 'edit-form',
  providers: [ EditElementComponent ],
  templateUrl: './edit-form-component.html',
  styleUrls: ['./edit-form-component.scss'],
  host: {'style' : 'width: 100%'}
})
/* tslint:enable */
export class EditFormComponent implements AfterContentInit {
  @Input() metaList: any[];
  @Input() linkedMap: any;
  @Input() value: Cloneable;

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
  }

  fieldChanged(change: ItemChange): void {
    if (!!change && this.value.hasOwnProperty(change.key)) {
      this.value[change.key] = change.value;
    }
  }

  getReferenceValue(meta: any): any {
    return this.value.hasOwnProperty(meta.id) ? this.value[meta.id] : null;
  }

  ngAfterContentInit(): void {
  }

}
