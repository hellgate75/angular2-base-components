import {Component, ElementRef, AfterContentInit, Inject, Input, Output, EventEmitter, OnChanges,
  SimpleChanges  } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ItemChange } from '../edit-dialog-component';

declare var jQuery: any;
declare var JSON: any;

/* tslint:disable */
@Component({
  selector: 'edit-element',
  providers: [ NgModel ],
  templateUrl: './form-element-component.html',
  styleUrls: ['./form-element-component.scss'],
  host: {'style' : 'width: 100%'}
})
/* tslint:enable */
export class EditElementComponent implements AfterContentInit, OnChanges {
  @Input() value: any;
  @Input() meta: any;
  @Input() elements: any;
  @Output() changed: EventEmitter<ItemChange>;
  mandatory: boolean = false;
  field: string = '';
  type: string = '';
  subType: string = '';
  name: string = '';
  elementsProto: any;
  mapProto: any;

  private _optionValues: any = {};

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
    this.changed = new EventEmitter<any>();
  }

  valueChanged(value: any, valid: boolean): void {
    if (valid) {
      let change: ItemChange = new ItemChange();
      change.key = this.field;
      change.value = value;
      this.changed.emit(change);
    }
  }

  getLinkedValues(): any[] {
    if (!!this.elements) {
      return <any[]>this.elements[this.meta.linkedService];
    }
    return [];
  }

  getOptionListKey(option: any, itemId?: any): any {
    if (!!itemId) {
      return option[itemId];
    }
    return option[this.elementsProto.id];
  }

  getOptionListValue(option: any, itemId?: any): any {
    if (!!itemId) {
      return option[itemId];
    }
    return option[this.elementsProto.name];
  }

  getOptionListSelected(option: any, itemId?: any, value?: any): any {
    if (!!itemId) {
      return this.getOptionListValue(option, itemId) === value;
    }
    return option[this.elementsProto.id] === this.value;
  }

  getOptionMapKey(option: any): any {
    let mapMeta = this.mapProto.fields.filter( (item: any) => {
      return item.index === 'id';
    } )[0];
    if (!!mapMeta) {
      return option[mapMeta.field];
    }
    return null;
  }

  getOptionMapValue(option: any): any {
    let mapMeta = this.mapProto.fields.filter( (item: any) => {
      return item.index === 'value';
    } )[0];
    if (!!mapMeta) {
      return option[mapMeta.mapField];
    }
    return null;
  }

  getOptionValueKey(option: any): any {
    let mapMeta = this.mapProto.fields.filter( (item: any) => {
      return item.index === 'value';
    } )[0];
    if (!!mapMeta) {
      return mapMeta.field;
    }
    return null;
  }

  getOptionIdKey(option: any): any {
    let mapMeta = this.mapProto.fields.filter( (item: any) => {
      return item.index === 'id';
    } )[0];
    if (!!mapMeta) {
      return mapMeta.field;
    }
    return null;
  }

  get optionValues(): any {
    return this._optionValues;
  }

  set optionValues(elem: any) {
    if (!!this.value && !!this.value.forEach) {
      this.value.forEach( (option: any, index: number) => {
        let mapMeta = this.mapProto.fields.filter( (item: any) => {
          return item.index === 'value';
        } )[0];
        if (!!mapMeta) {
          this._optionValues[index][mapMeta.field] = elem[mapMeta.field];
          option[mapMeta.field] = elem[mapMeta.field];
        }
      });
    }
  }

  textKeyDown(event: any): void {
    let value: string = event.target.value;
    this.valueChanged(value, (!this.mandatory || !!value.length));
  }
  textMapKeyDown(event: any, index: number, item: any): void {
    let value: string = event.target.value;
    if (!!item) {
      item[this.getOptionValueKey(item)] = value;
    }
    this._optionValues[index][this.getOptionValueKey(item)] = value;
  }

  listSelect(event: any): void {
    let value: string = event.target.value;
    this.valueChanged(value, (!this.mandatory || !!value.length));
  }

  listSelectMap(event: any, index: number, item: any): void {
    let value: any = event.target.value;
    if (!!item) {
      item[this.getOptionIdKey(item)] = value;
    }
    this._optionValues[index][this.getOptionIdKey(item)] = value;
  }

  removeItem(index: number, item: any): void {
    if (!!item) {
      this.value.splice(index, 1);
    }
    this._optionValues[index] = undefined;
  }

  addItem(): void {
    let newValue: any = null;
    let mapMetaIndex = this.mapProto.fields.filter( (item: any) => {
      return item.index === 'id';
    } )[0];
    let mapMeta = this.mapProto.fields.filter( (item: any) => {
      return item.index === 'value';
    } )[0];
    if (!!mapMeta && !!mapMetaIndex) {
      newValue = {};
      newValue[mapMeta.field] = null;
      let firstLinked: any = this.getLinkedValues()[0];
      newValue[mapMetaIndex.field] = firstLinked[this.getOptionIdKey(firstLinked)];
    }
    if (!!newValue) {
      this._optionValues[this.value.length] = newValue;
      this.value.push(newValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.meta && !!this.meta.type) {
      if (this.meta.type === 'map' || this.meta.type === 'list') {
        this.ngAfterContentInit();
      }
    }
  }

  ngAfterContentInit(): void {
    if (!this.meta) {
      throw 'EditElementComponent: unable to load meta data ...';
    }
    this.mandatory = this.meta.mandatory || false;
    this.field = this.meta.id || '';
    this.name = this.meta.name || '';
    this.type = this.meta.type || '';
    this.subType = this.meta.subType || '';
    if (!this.meta.linkedId) {
      this.elementsProto = {id: '', name: ''};
    } else {
      this.elementsProto = {id: this.meta.linkedId, name: (this.meta.linkedDesc || this.meta.linkedId)};
    }
    this.mapProto = {fields: []};
    if ( !!this.meta.mapType) {
      let mapFields: string[] = this.meta.mapType.split(',');
      mapFields.forEach( (next: string) => {
        if (next.indexOf('#') > 0) {
          if (next.indexOf(':') > 0) {
            // linear field link association
            let linearIndex: string[] = next.split('#');
            let fieldMap = linearIndex[1].split(':');
            this.mapProto.fields.push({index: linearIndex[0], field: fieldMap[0], mapField: fieldMap[1]});
          } else if (next.indexOf('@') > 0) {
            // type field association
            let typedIndex: string[] = next.split('#');
            let typeMap = typedIndex[1].split(':');
            let typeElem = typeMap[1].split('@');
            this.mapProto.fields.push({index: typedIndex[0], field: typeMap[0], mapField: typeElem[0], type: typeElem[1]});
          }
        }
      });
      if (!!this.value && !!this.value.forEach) {
        this.value.forEach( (option: any, index: number) => {
          let mapMetaIndex = this.mapProto.fields.filter( (item: any) => {
            return item.index === 'id';
          } )[0];
          let mapMeta = this.mapProto.fields.filter( (item: any) => {
            return item.index === 'value';
          } )[0];
          if (!!mapMeta && !!mapMetaIndex) {
            this._optionValues[index] = {};
            this._optionValues[index][mapMeta.field] = option[mapMeta.field];
            this._optionValues[index][mapMetaIndex.field] = option[mapMetaIndex.field];
          }
        });
      }
    }
  }

}
