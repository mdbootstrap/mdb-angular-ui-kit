import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MdbTooltipComponent } from './tooltip.component';
import { MdbTooltipPosition } from './tooltip.types';
import { fromEvent, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbTooltip]',
  exportAs: 'mdbTooltip',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbTooltipDirective implements OnInit, OnDestroy {
  @Input() mdbTooltip = '';
  @Input() tooltipDisabled = false;
  @Input() placement: MdbTooltipPosition = 'top';
  @Input() html = false;
  @Input() animation = true;
  @Input() trigger = 'hover focus';
  @Input() delayShow = 0;
  @Input() delayHide = 0;
  @Input() offset = 4;

  @Output() tooltipShow: EventEmitter<MdbTooltipDirective> = new EventEmitter();
  @Output() tooltipShown: EventEmitter<MdbTooltipDirective> = new EventEmitter();
  @Output() tooltipHide: EventEmitter<MdbTooltipDirective> = new EventEmitter();
  @Output() tooltipHidden: EventEmitter<MdbTooltipDirective> = new EventEmitter();

  private _overlayRef: OverlayRef;
  private _tooltipRef: ComponentRef<MdbTooltipComponent>;
  private _open = false;
  private _showTimeout: any = 0;
  private _hideTimeout: any = 0;

  readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (this.tooltipDisabled) {
      return;
    }

    this._bindTriggerEvents();
  }

  ngOnDestroy(): void {
    if (this._open || this._showTimeout) {
      this.hide();
    }

    this._destroy$.next();
    this._destroy$.complete();
  }

  private _bindTriggerEvents(): void {
    const triggers = this.trigger.split(' ');

    triggers.forEach((trigger) => {
      if (trigger === 'click') {
        fromEvent(this._elementRef.nativeElement, trigger)
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => this.toggle());
      } else if (trigger !== 'manual') {
        const evIn = trigger === 'hover' ? 'mouseenter' : 'focusin';
        const evOut = trigger === 'hover' ? 'mouseleave' : 'focusout';

        fromEvent(this._elementRef.nativeElement, evIn)
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => this.show());
        fromEvent(this._elementRef.nativeElement, evOut)
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => this.hide());
      }
    });
  }

  private _createOverlayConfig(): OverlayConfig {
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions(this._getPosition());
    const overlayConfig = new OverlayConfig({
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create(this._createOverlayConfig());
  }

  private _getPosition(): ConnectedPosition[] {
    let position;

    const positionTop = {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -this.offset,
    };

    const positionBottom = {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: this.offset,
    };

    const positionRight = {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: this.offset,
    };

    const positionLeft = {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -this.offset,
    };

    switch (this.placement) {
      case 'top':
        position = [positionTop, positionBottom];
        break;
      case 'bottom':
        position = [positionBottom, positionTop];
        break;
      case 'left':
        position = [positionLeft, positionRight];
        break;
      case 'right':
        position = [positionRight, positionLeft];
        break;
      default:
        break;
    }

    return position;
  }

  show(): void {
    if (this._hideTimeout || this._open) {
      this._overlayRef.detach();
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    this._createOverlay();

    this._showTimeout = setTimeout(() => {
      const tooltipPortal = new ComponentPortal(MdbTooltipComponent);

      this.tooltipShow.emit(this);
      this._open = true;

      this._tooltipRef = this._overlayRef.attach(tooltipPortal);
      this._tooltipRef.instance.title = this.mdbTooltip;
      this._tooltipRef.instance.html = this.html;
      this._tooltipRef.instance.animation = this.animation;
      this._tooltipRef.instance.animationState = 'visible';

      this._tooltipRef.instance.markForCheck();

      this.tooltipShown.emit(this);
    }, this.delayShow);
  }

  hide(): void {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
      this._showTimeout = null;
    } else {
      return;
    }

    this._hideTimeout = setTimeout(() => {
      this.tooltipHide.emit(this);

      if (!this._tooltipRef) {
        this._overlayRef.detach();
        this._open = false;
        this.tooltipHidden.emit(this);
      } else {
        this._tooltipRef.instance._hidden.pipe(first()).subscribe(() => {
          this._overlayRef.detach();
          this._open = false;
          this.tooltipHidden.emit(this);
        });
        this._tooltipRef.instance.animationState = 'hidden';
        this._tooltipRef.instance.markForCheck();
      }
    }, this.delayHide);
  }

  toggle(): void {
    if (this._open) {
      this.hide();
    } else {
      this.show();
    }
  }
}
