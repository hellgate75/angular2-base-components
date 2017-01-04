import {Component, ElementRef, AfterContentInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import {Cloneable} from '../../models/base-model';
import { EditFormComponent } from './editform/edit-form-component';
export { Cloneable, ItemChange } from '../../models/base-model';

declare var jQuery: any;
declare var JSON: any;

/* tslint:disable */
@Component({
  selector: 'edit-dialog',
  providers: [ EditFormComponent ],
  templateUrl: './edit-dialog-component.html',
  styleUrls: ['./edit-dialog-component.scss'],
  host: {'style' : 'width: 100%'}
})
/* tslint:enable */
export class EditDialogComponent implements AfterContentInit {
  @Input() metadata: any;
  @Input() linkeddata: any;
  @Input() activation: EventEmitter<Cloneable>;
  @Input() height: number;
  @Input() width: number;
  @Output() changed: EventEmitter<Cloneable>;
  reference: Cloneable;
  model: Cloneable;

  constructor(@Inject(ElementRef) private elementRef: ElementRef) {
    this.changed = new EventEmitter<Cloneable>();
  }

  save(): void {
    // No local save
    // (<any>this.reference).reverse(this.model);
    this.changed.emit(this.model.clone());
    this.hide();
  }

  cancel(): void {
    this.hide();
  }

  show(): void {
    jQuery(this.elementRef.nativeElement).dialog('open');
  }

  hide(): void {
    jQuery(this.elementRef.nativeElement).dialog('close');
  }

  ngAfterContentInit(): void {
    jQuery(this.elementRef.nativeElement).dialog({
      modal: true,
      autoOpen: false,
      width: this.width,
      height: this.height,
      dialogClass: 'no-close',
      open: (event: any, ui: any) => {
        jQuery('.ui-dialog-titlebar', ui.dialog | ui).hide();
        jQuery('button', ui.dialog | ui).each((index: number, item: any) => {
          let btn: any = jQuery(item);
          if (item.className === '') {
            btn.addClass('btn').addClass((item.innerHTML === 'Confirm') ? 'btn-primary' : 'btn-secondary');
          }
        });
        jQuery(this).add(jQuery('#dialog-content'));
        jQuery('#dialog-content').show();
      },
      buttons: [
        {
          text: 'Confirm',
          click: function() {
            this.save();
          }.bind(this)
        },
        {
          text: 'Cancel',
          click: function() {
            this.cancel();
          }.bind(this)
        }
      ],
      closeOnEscape: false,
      draggable: false,
      resizable: false
    });
    if (!!this.activation) {
      this.activation.subscribe(
        (next: Cloneable) => {
          // TODO: Form Activation and data reset;
          this.reference = next;
          this.model = next.clone();
          this.show();
        }
      );
    }
  }

}
