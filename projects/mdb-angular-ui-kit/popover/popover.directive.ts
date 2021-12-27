import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { MdbPopoverComponent } from './popover.component';
import { fromEvent, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbPopover]',
  exportAs: 'mdbPopover',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbPopoverDirective implements OnInit, OnDestroy {
  @Input() mdbPopover: TemplateRef<any> | string = '';
  @Input() mdbPopoverTitle = '';

  @Input()
  get popoverDisabled(): boolean {
    return this._popoverDisabled;
  }
  set popoverDisabled(value: boolean) {
    this._popoverDisabled = coerceBooleanProperty(value);
  }
  private _popoverDisabled = false;

  @Input() placement = 'top';
  @Input() template: TemplateRef<any>;

  @Input()
  get animation(): boolean {
    return this._animation;
  }
  set animation(value: boolean) {
    this._animation = coerceBooleanProperty(value);
  }
  private _animation = false;

  @Input() trigger = 'click';
  @Input() delayShow = 0;
  @Input() delayHide = 0;
  @Input() offset = 4;

  @Output() popoverShow: EventEmitter<MdbPopoverDirective> = new EventEmitter();
  @Output() popoverShown: EventEmitter<MdbPopoverDirective> = new EventEmitter();
  @Output() popoverHide: EventEmitter<MdbPopoverDirective> = new EventEmitter();
  @Output() popoverHidden: EventEmitter<MdbPopoverDirective> = new EventEmitter();

  private _overlayRef: OverlayRef;
  private _tooltipRef: ComponentRef<MdbPopoverComponent>;
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
    if (this.popoverDisabled) {
      return;
    }

    this._bindTriggerEvents();
  }

  ngOnDestroy(): void {
    if (this._open) {
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
        position = [positionLeft, positionRight, positionTop, positionBottom];
        break;
      case 'right':
        position = [positionRight, positionLeft, positionTop, positionBottom];
        break;
      default:
        break;
    }

    return position;
  }

  show(): void {
    if (this._hideTimeout) {
      this._overlayRef.detach();
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    this._createOverlay();

    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = null;
    }

    this._showTimeout = setTimeout(() => {
      const tooltipPortal = new ComponentPortal(MdbPopoverComponent);

      this.popoverShow.emit(this);
      this._open = true;

      this._tooltipRef = this._overlayRef.attach(tooltipPortal);

      this._tooltipRef.instance.content = this.template || this.mdbPopover;
      this._tooltipRef.instance.title = this.mdbPopoverTitle;
      this._tooltipRef.instance.animation = this.animation;
      this._tooltipRef.instance.animationState = 'visible';
      this._tooltipRef.instance.markForCheck();

      this.popoverShown.emit(this);
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
      this.popoverHide.emit(this);
      if (!this._tooltipRef) {
        this._overlayRef.detach();
        this._open = false;
        this.popoverHidden.emit(this);
      } else {
        this._tooltipRef.instance._hidden.pipe(first()).subscribe(() => {
          this._overlayRef.detach();
          this._open = false;
          this.popoverHidden.emit(this);
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

  static ngAcceptInputType_animation: BooleanInput;
  static ngAcceptInputType_popoverDisabled: BooleanInput;
}
