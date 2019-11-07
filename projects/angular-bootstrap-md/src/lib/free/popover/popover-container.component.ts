import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { PopoverConfig } from './popover.config';
import { isBs3 } from '../utils/ng2-bootstrap-config';

@Component({
  selector: 'mdb-popover-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="popover-header" [ngClass]="headerClass" *ngIf="title">{{ title }}</h3>
    <div class="popover-body" [ngClass]="bodyClass">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./popover-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopoverContainerComponent implements OnInit {
  @Input() public placement: string;
  @Input() public title: string;
  public containerClass: string;
  public bodyClass: string;
  public headerClass: string;
  @HostBinding('class.show') show = '!isBs3';
  @HostBinding('attr.role') role = 'tooltip';

  @HostBinding('class') class: any;
  public get isBs3(): boolean {
    return isBs3();
  }

  public constructor(config: PopoverConfig) {
    Object.assign(this, config);
  }

  ngOnInit() {
    this.class =
      'popover-fadeIn popover in popover-' +
      this.placement +
      ' ' +
      this.placement +
      ' bs-popover-' +
      this.placement +
      ' ' +
      this.containerClass;
  }
}
