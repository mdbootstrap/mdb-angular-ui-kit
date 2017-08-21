import { ChangeDetectionStrategy, Input, Component, HostBinding } from '@angular/core';
import { PopoverConfig } from './popover.config';
import { isBs3 } from '../utils/ng2-bootstrap-config';

@Component({
  selector: 'mdb-popover-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="popover-arrow arrow"></div>
  <h3 class="popover-header" *ngIf="title">{{title}}</h3>
  <div class="popover-body">
    <ng-content></ng-content>
  </div>`
})
export class PopoverContainerComponent {
  @HostBinding('class.show') show = '!isBs3';
  @HostBinding('attr.role') role = 'tooltip';
  @HostBinding('class') class = '"popover-fadeIn popover in popover-" + placement + " " + placement';

  @Input() public placement: string;
  @Input() public title: string;

  public get isBs3(): boolean {
    return isBs3();
  }

  public constructor(config: PopoverConfig) {
    Object.assign(this, config);
  }
}
