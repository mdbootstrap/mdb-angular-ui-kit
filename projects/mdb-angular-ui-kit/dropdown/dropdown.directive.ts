import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ContentChild } from '@angular/core';
import { MdbDropdownToggleDirective } from './dropdown-toggle.directive';
import { MdbDropdownMenuDirective } from './dropdown-menu.directive';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';

export type MdbDropdownPositionClass = 'dropdown' | 'dropup' | 'dropstart' | 'dropend';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mdbDropdown]',
  templateUrl: 'dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('150ms linear')),
      transition('hidden => visible', [style({ opacity: 0 }), animate('150ms linear')]),
    ]),
  ],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbDropdownDirective implements OnDestroy, AfterContentInit {
  @ViewChild('dropdownTemplate') _template: TemplateRef<any>;
  @ContentChild(MdbDropdownToggleDirective, { read: ElementRef }) _dropdownToggle: ElementRef;
  @ContentChild(MdbDropdownMenuDirective) _dropdownMenu: MdbDropdownMenuDirective;

  @Input({ transform: booleanAttribute }) animation = true;
  @Input({ transform: booleanAttribute }) closeOnEsc = true;
  @Input({ transform: booleanAttribute }) closeOnItemClick = true;
  @Input({ transform: booleanAttribute }) closeOnOutsideClick = true;
  @Input({ transform: numberAttribute }) offset = 0;
  @Input()
  get positionClass(): MdbDropdownPositionClass {
    return this._positionClass;
  }
  set positionClass(newClass: MdbDropdownPositionClass) {
    const isSameClass = this.host.classList.contains(newClass);
    if (this._positionClass !== newClass && !isSameClass) {
      const positionClasses = ['dropdown', 'dropup', 'dropstart', 'dropend'];
      positionClasses.forEach((className) => {
        this._renderer.removeClass(this.host, className);
      });
      this._renderer.addClass(this.host, newClass);
    }
    this._updateOverlay();
  }
  private _positionClass: MdbDropdownPositionClass;
  @Input({ transform: booleanAttribute }) withPush = false;

  @Output() dropdownShow: EventEmitter<MdbDropdownDirective> = new EventEmitter();
  @Output() dropdownShown: EventEmitter<MdbDropdownDirective> = new EventEmitter();
  @Output() dropdownHide: EventEmitter<MdbDropdownDirective> = new EventEmitter();
  @Output() dropdownHidden: EventEmitter<MdbDropdownDirective> = new EventEmitter();

  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;
  private _open = false;
  private _isDropUp: boolean;
  private _isDropStart: boolean;
  private _isDropEnd: boolean;
  private _isDropdownMenuEnd: boolean;
  private _xPosition: string;
  private _breakpoints: any;
  private _mousedownTarget: HTMLElement | null = null;

  readonly _destroy$: Subject<void> = new Subject<void>();

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  _breakpointSubscription: any;
  _animationState = 'hidden';

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private _vcr: ViewContainerRef,
    private _breakpointObserver: BreakpointObserver,
    private _cdRef: ChangeDetectorRef,
    private _renderer: Renderer2
  ) {
    this._breakpoints = {
      isSm: this._breakpointObserver.isMatched('(min-width: 576px)'),
      isMd: this._breakpointObserver.isMatched('(min-width: 768px)'),
      isLg: this._breakpointObserver.isMatched('(min-width: 992px)'),
      isXl: this._breakpointObserver.isMatched('(min-width: 1200px)'),
      isXxl: this._breakpointObserver.isMatched('(min-width: 1400px)'),
    };
  }

  ngAfterContentInit(): void {
    this._bindDropdownToggleClick();
    this._listenToMenuPositionClassChange();
  }

  ngOnDestroy(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }

    this._destroy$.next();
    this._destroy$.complete();
  }

  private _bindDropdownToggleClick(): void {
    fromEvent(this._dropdownToggle.nativeElement, 'click')
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.toggle());
  }

  private _listenToMenuPositionClassChange(): void {
    this._dropdownMenu.menuPositionClassChanged
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._updateOverlay());
  }

  private _updateOverlay() {
    this._overlayRef?.updatePositionStrategy(this._createPositionStrategy());
  }

  private _createOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy: this._createPositionStrategy(),
    });
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create(this._createOverlayConfig());
  }

  private _createPositionStrategy(): FlexibleConnectedPositionStrategy {
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._dropdownToggle)
      .withPositions(this._getPosition())
      .withFlexibleDimensions(false)
      .withPush(this.withPush);

    return positionStrategy;
  }

  private _getPosition(): ConnectedPosition[] {
    this._isDropUp = this.host.classList.contains('dropup');
    this._isDropStart = this.host.classList.contains('dropstart');
    this._isDropEnd = this.host.classList.contains('dropend');
    this._isDropdownMenuEnd =
      this._dropdownMenu.elementRef.nativeElement.classList.contains('dropdown-menu-end');
    this._xPosition = this._isDropdownMenuEnd ? 'end' : 'start';

    const regex = new RegExp(/dropdown-menu-(sm|md|lg|xl|xxl)-(start|end)/, 'g');

    const responsiveClass = this._dropdownMenu.elementRef.nativeElement.className.match(regex);

    if (responsiveClass) {
      this._subscribeBrakpoints();

      const positionRegex = new RegExp(/start|end/, 'g');
      const breakpointRegex = new RegExp(/(sm|md|lg|xl|xxl)/, 'g');

      const dropdownPosition = positionRegex.exec(responsiveClass)[0];
      const breakpoint = breakpointRegex.exec(responsiveClass)[0];

      switch (true) {
        case breakpoint === 'xxl' && this._breakpoints.isXxl:
          this._xPosition = dropdownPosition;
          break;
        case breakpoint === 'xl' && this._breakpoints.isXl:
          this._xPosition = dropdownPosition;
          break;
        case breakpoint === 'lg' && this._breakpoints.isLg:
          this._xPosition = dropdownPosition;
          break;
        case breakpoint === 'md' && this._breakpoints.isMd:
          this._xPosition = dropdownPosition;
          break;
        case breakpoint === 'sm' && this._breakpoints.isSm:
          this._xPosition = dropdownPosition;
          break;
        default:
          break;
      }
    }

    let position;

    const positionDropup = {
      originX: this._xPosition,
      originY: 'top',
      overlayX: this._xPosition,
      overlayY: 'bottom',
      offsetY: -this.offset,
    };

    const positionDropdown = {
      originX: this._xPosition,
      originY: 'bottom',
      overlayX: this._xPosition,
      overlayY: 'top',
      offsetY: this.offset,
    };

    const positionDropstart = {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: this.offset,
    };

    const positionDropend = {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: -this.offset,
    };

    switch (true) {
      case this._isDropEnd:
        position = [positionDropend, positionDropstart];
        break;
      case this._isDropStart:
        position = [positionDropstart, positionDropend];
        break;
      case this._isDropUp:
        position = [positionDropup, positionDropdown];
        break;
      default:
        position = [positionDropdown, positionDropup];
        break;
    }

    return position;
  }

  private _listenToEscKeyup(overlayRef: OverlayRef): Observable<KeyboardEvent> {
    return fromEvent(document, 'keyup').pipe(
      filter((event: KeyboardEvent) => event.key === 'Escape'),
      takeUntil(overlayRef.detachments())
    );
  }

  private _listenToMousedown(overlayRef: OverlayRef): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(document, 'mousedown').pipe(takeUntil(overlayRef.detachments()));
  }

  private _listenToClick(overlayRef: OverlayRef, origin: HTMLElement): Observable<MouseEvent> {
    return fromEvent(document, 'click').pipe(
      filter((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const isInsideMenu = this._dropdownMenu.elementRef.nativeElement.contains(target);
        const notTogglerIcon = !this._dropdownToggle.nativeElement.contains(target);
        const notCustomContent =
          !isInsideMenu || (target.classList && target.classList.contains('dropdown-item'));
        const notOrigin = target !== origin;
        return notOrigin && notTogglerIcon && notCustomContent;
      }),
      takeUntil(overlayRef.detachments())
    );
  }

  public onAnimationEnd(event: AnimationEvent): void {
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this._overlayRef.detach();
      this._open = false;

      this._renderer.setAttribute(this._dropdownToggle.nativeElement, 'aria-expanded', 'false');

      this.dropdownHidden.emit(this);
    }

    if (event.fromState === 'hidden' && event.toState === 'visible') {
      this.dropdownShown.emit(this);
    }
  }

  private _subscribeBrakpoints(): void {
    const brakpoints = [
      '(min-width: 576px)',
      '(min-width: 768px)',
      '(min-width: 992px)',
      '(min-width: 1200px)',
      '(min-width: 1400px)',
    ];

    this._breakpointSubscription = this._breakpointObserver
      .observe(brakpoints)
      .pipe(takeUntil(this._destroy$))
      .subscribe((result) => {
        Object.keys(this._breakpoints).forEach((key, index) => {
          const brakpointValue = brakpoints[index];
          const newBreakpoint = result.breakpoints[brakpointValue];
          const isBreakpointChanged = newBreakpoint !== this._breakpoints[key];

          if (!isBreakpointChanged) {
            return;
          }

          this._breakpoints[key] = newBreakpoint;

          if (this._open) {
            this._updateOverlay();
          }
        });
      });
  }

  show(): void {
    this._cdRef.markForCheck();

    if (this._open) {
      return;
    }

    if (!this._overlayRef) {
      this._createOverlay();
    }

    this._portal = new TemplatePortal(this._template, this._vcr);

    this.dropdownShow.emit(this);

    this._open = true;

    this._renderer.setAttribute(this._dropdownToggle.nativeElement, 'aria-expanded', 'true');

    this._overlayRef.attach(this._portal);

    this._listenToEscKeyup(this._overlayRef).subscribe((isEsc) => {
      if (isEsc && this.closeOnEsc) {
        this.hide();
      }
    });

    this._overlayRef
      .keydownEvents()
      .pipe(takeUntil(this._overlayRef.detachments()))
      .subscribe((event: KeyboardEvent) => {
        this._handleKeyboardNavigation(event);
      });

    this._listenToMousedown(this._overlayRef).subscribe((event) => {
      this._mousedownTarget = event.target as HTMLElement;
    });

    this._listenToClick(this._overlayRef, this._dropdownToggle.nativeElement).subscribe((event) => {
      const target = event.target as HTMLElement;
      const isDropdownItem = target.classList && target.classList.contains('dropdown-item');

      const isOnMousedownDropdownMenu = this._dropdownMenu.elementRef.nativeElement.contains(
        this._mousedownTarget
      );

      this._mousedownTarget = null;

      if (this.closeOnItemClick && isDropdownItem) {
        this.hide();
        return;
      }
      if (this.closeOnOutsideClick && !isDropdownItem && !isOnMousedownDropdownMenu) {
        this.hide();
        return;
      }
    });

    this._animationState = 'visible';
  }

  private _handleKeyboardNavigation(event: KeyboardEvent) {
    const items: HTMLElement[] = Array.from(
      this._dropdownMenu.elementRef.nativeElement.querySelectorAll('.dropdown-item')
    );
    const key = event.key;
    const activeElement = this._dropdownMenu.elementRef.nativeElement.ownerDocument.activeElement;

    if (items.length === 0) {
      return;
    }

    let index = items.indexOf(activeElement);

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();

        index = Math.min(index + 1, items.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();

        if (index === -1) {
          index = items.length - 1;
          break;
        }
        index = Math.max(index - 1, 0);
        break;
    }

    const nextActiveElement: HTMLElement = items[index];

    if (nextActiveElement) {
      nextActiveElement.focus();
    }
  }

  hide(): void {
    this._cdRef.markForCheck();

    if (!this._open) {
      return;
    }

    this.dropdownHide.emit(this);

    this._animationState = 'hidden';
  }

  toggle(): void {
    this._cdRef.markForCheck();

    if (this._open) {
      this.hide();
    } else {
      this.show();
    }
  }
}
