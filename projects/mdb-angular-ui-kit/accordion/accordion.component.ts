import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
} from '@angular/core';
import { startWith, switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { MdbAccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'mdb-accordion',
  templateUrl: './accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbAccordionComponent implements AfterContentInit {
  @ContentChildren(MdbAccordionItemComponent) items: QueryList<MdbAccordionItemComponent>;

  @Input() flush = false;
  @Input() multiple = false;

  @HostBinding('class.accordion') accordion = true;
  @HostBinding('class.accordion-flush')
  get addFlushClass(): boolean {
    return this.flush;
  }

  constructor() {}

  ngAfterContentInit(): void {
    this.items.changes
      .pipe(
        startWith(this.items),
        switchMap((items: QueryList<MdbAccordionItemComponent>) => {
          return merge(...items.map((item: MdbAccordionItemComponent) => item.show$));
        })
      )
      .subscribe((clickedItem: MdbAccordionItemComponent) =>
        this._handleMultipleItems(clickedItem)
      );
  }

  private _handleMultipleItems(clickedItem: MdbAccordionItemComponent): void {
    if (!this.multiple) {
      const itemsToClose = this.items.filter(
        (item: MdbAccordionItemComponent) => item !== clickedItem && !item._collapsed
      );

      itemsToClose.forEach((item: MdbAccordionItemComponent) => item.hide());
    }
  }
}
