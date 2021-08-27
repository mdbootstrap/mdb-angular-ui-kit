import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';
import { Subject } from 'rxjs';
import { MDB_ACCORDION_ITEM_BODY } from './accordion-item-content.directive';
import { MDB_ACCORDION_ITEM_HEADER } from './accordion-item-header.directive';

let uniqueHeaderId = 0;
let uniqueId = 0;

@Component({
  selector: 'mdb-accordion-item',
  templateUrl: './accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbAccordionItemComponent implements OnInit {
  @ContentChild(MDB_ACCORDION_ITEM_HEADER, { read: TemplateRef, static: true })
  _headerTemplate: TemplateRef<any>;

  @ContentChild(MDB_ACCORDION_ITEM_BODY, { read: TemplateRef, static: true })
  _bodyTemplate: TemplateRef<any>;

  @ViewChild(MdbCollapseDirective, { static: true }) collapse: MdbCollapseDirective;

  @Input() header: string;
  @Input()
  set collapsed(value: boolean) {
    if (!this._isInitialized) {
      if (!value) {
        this._shouldOpenOnInit = true;
      }
      return;
    }

    if (value) {
      this.hide();
    } else {
      this.show();
    }
  }

  @Input() id = `mdb-accordion-item-${uniqueId++}`;

  _headerId = `mdb-accordion-item-header-${uniqueHeaderId++}`;

  private _isInitialized = false;
  private _shouldOpenOnInit = false;

  @Output() itemShow: EventEmitter<MdbAccordionItemComponent> = new EventEmitter();
  @Output() itemShown: EventEmitter<MdbAccordionItemComponent> = new EventEmitter();
  @Output() itemHide: EventEmitter<MdbAccordionItemComponent> = new EventEmitter();
  @Output() itemHidden: EventEmitter<MdbAccordionItemComponent> = new EventEmitter();

  @HostBinding('class.accordion-item') accordionItem = true;

  ngOnInit(): void {
    this._isInitialized = true;

    if (this._shouldOpenOnInit) {
      this.show();
    }
  }

  show$ = new Subject<MdbAccordionItemComponent>();

  _collapsed = true;
  _addCollapsedClass = true;

  constructor(private _cdRef: ChangeDetectorRef) {}

  toggle(): void {
    this.collapse.toggle();
  }

  show(): void {
    this.collapse.show();
    this._cdRef.markForCheck();
  }

  hide(): void {
    this.collapse.hide();
    this._cdRef.markForCheck();
  }

  onShow(): void {
    this._addCollapsedClass = false;
    this.itemShow.emit(this);

    this.show$.next(this);
  }

  onHide(): void {
    this._addCollapsedClass = true;
    this.itemHide.emit(this);
  }

  onShown(): void {
    this._collapsed = false;
    this.itemShown.emit(this);
  }

  onHidden(): void {
    this._collapsed = true;
    this.itemHidden.emit(this);
  }
}
