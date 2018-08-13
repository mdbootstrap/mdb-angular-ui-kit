import { AfterViewInit, Component, ChangeDetectionStrategy, HostBinding, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { TooltipConfig } from './tooltip.service';
import { isBs3 } from '../utils/ng2-bootstrap-config';

@Component({
  selector: 'mdb-tooltip-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line
  host: {
    '[class]': '"tooltip-fadeIn tooltip in tooltip-" + placement'
  },
  template: `
  <div #tooltipArrow class="tooltip-arrow" [ngClass]="{'left': placement == 'left', 'right': placement == 'right', 'top': placement == 'top'}"></div>
  <div #tooltipInner class="tooltip-inner"><ng-content></ng-content></div>
  `
})
export class TooltipContainerComponent implements AfterViewInit {
  public classMap: any;
  public placement: string;
  public popupClass: string;
  public animation: boolean;
  @ViewChild('tooltipInner') tooltipInner: ElementRef;
  @ViewChild('tooltipArrow') tooltipArrow: ElementRef;
  @HostBinding('class.show') show = !this.isBs3;

  public get isBs3(): boolean {
    return isBs3();
  }

  public constructor(config: TooltipConfig, private r: Renderer2) {
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
    setTimeout(() => {
      const arrowClassList = this.tooltipArrow.nativeElement.classList;
      const tooltipHeight = this.tooltipInner.nativeElement.clientHeight;
      if (arrowClassList.contains('top')) {
        this.r.setStyle(this.tooltipArrow.nativeElement, 'top', tooltipHeight + 6 + 'px');
      } else if (arrowClassList.contains('left')) {
        this.r.setStyle(this.tooltipArrow.nativeElement, 'top',  (tooltipHeight / 2) + 'px');
      } else if (arrowClassList.contains('right')) {
        this.r.setStyle(this.tooltipArrow.nativeElement, 'top',  (tooltipHeight / 2) + 'px');
      }
    }, 0);

  }
}
