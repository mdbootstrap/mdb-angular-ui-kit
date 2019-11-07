import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TooltipConfig } from './tooltip.service';
import { isBs3 } from '../utils/ng2-bootstrap-config';

@Component({
  selector: 'mdb-tooltip-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #tooltipArrow class="tooltip-arrow arrow"></div>
    <div #tooltipInner class="tooltip-inner">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['tooltip-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TooltipContainerComponent implements AfterViewInit {
  public classMap: any;
  public placement: string;
  public popupClass: string;
  public animation: boolean;

  @Input() containerClass = '';
  @ViewChild('tooltipInner', { static: true }) tooltipInner: ElementRef;
  @ViewChild('tooltipArrow', { static: true }) tooltipArrow: ElementRef;
  @HostBinding('class.show') show = !this.isBs3;
  @HostBinding('class')
  get tooltipClasses() {
    return `tooltip-fadeIn tooltip in tooltip-${this.placement} bs-tooltip-${this.placement} ${this.placement} ${this.containerClass}`;
  }

  public get isBs3(): boolean {
    return isBs3();
  }

  public constructor(config: TooltipConfig, public elem: ElementRef) {
    Object.assign(this, config);
  }

  public ngAfterViewInit(): void {
    this.classMap = { in: false, fade: false };
    this.classMap[this.placement] = true;
    this.classMap['tooltip-' + this.placement] = true;

    this.classMap.in = true;
    if (this.animation) {
      this.classMap.fade = true;
    }

    if (this.popupClass) {
      this.classMap[this.popupClass] = true;
    }
  }
}
