import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MdbCarouselItemComponent } from './carousel-item.component';

export enum Direction {
  UNKNOWN,
  NEXT,
  PREV,
}

@Component({
  selector: 'mdb-carousel',
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbCarouselComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(MdbCarouselItemComponent) _items: QueryList<MdbCarouselItemComponent>;
  get items(): MdbCarouselItemComponent[] {
    return this._items && this._items.toArray();
  }

  @Input() animation: 'slide' | 'fade' = 'slide';

  @Input()
  get controls(): boolean {
    return this._controls;
  }
  set controls(value: boolean) {
    this._controls = coerceBooleanProperty(value);
  }
  private _controls = false;

  @Input()
  get dark(): boolean {
    return this._dark;
  }
  set dark(value: boolean) {
    this._dark = coerceBooleanProperty(value);
  }
  private _dark = false;

  @Input()
  get indicators(): boolean {
    return this._indicators;
  }
  set indicators(value: boolean) {
    this._indicators = coerceBooleanProperty(value);
  }
  private _indicators = false;

  @Input()
  get ride(): boolean {
    return this._ride;
  }
  set ride(value: boolean) {
    this._ride = coerceBooleanProperty(value);
  }
  private _ride = true;

  @Input()
  get interval(): number {
    return this._interval;
  }
  set interval(value: number) {
    this._interval = value;

    if (this.items) {
      this._restartInterval();
    }
  }
  private _interval = 5000;

  @Input() keyboard = true;
  @Input() pause = true;
  @Input() wrap = true;

  @Output() slide: EventEmitter<void> = new EventEmitter();
  @Output() slideChange: EventEmitter<void> = new EventEmitter();

  get activeSlide(): number {
    return this._activeSlide;
  }

  set activeSlide(index: number) {
    if (this.items.length && this._activeSlide !== index) {
      this._activeSlide = index;
      this._restartInterval();
    }
  }
  private _activeSlide = 0;

  private _lastInterval: any;
  private _isPlaying = false;
  private _isSliding = false;

  private readonly _destroy$: Subject<void> = new Subject<void>();

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.pause && this._isPlaying) {
      this.stop();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.pause && !this._isPlaying) {
      this.play();
    }
  }

  constructor(private _elementRef: ElementRef, private _cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this._setActiveSlide(this._activeSlide);

      if (this.interval > 0 && this.ride) {
        this.play();
      }
      this._cdRef.markForCheck();
    });

    if (this.keyboard) {
      fromEvent(this._elementRef.nativeElement, 'keydown')
        .pipe(takeUntil(this._destroy$))
        .subscribe((event: KeyboardEvent) => {
          if (event.key === 'ArrowRight') {
            this.next();
          } else if (event.key === 'ArrowLeft') {
            this.prev();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setActiveSlide(index: number): void {
    const currentSlide = this.items[this._activeSlide];
    currentSlide.active = false;

    const newSlide = this.items[index];
    newSlide.active = true;
    this._activeSlide = index;
  }

  private _restartInterval(): void {
    this._resetInterval();
    const activeElement = this.items[this.activeSlide];
    const interval = activeElement.interval ? activeElement.interval : this.interval;

    if (!isNaN(interval) && interval > 0) {
      this._lastInterval = setInterval(() => {
        const nInterval = +interval;
        if (this._isPlaying && !isNaN(nInterval) && nInterval > 0) {
          this.next();
        } else {
          this.stop();
        }
      }, interval);
    }
  }

  private _resetInterval(): void {
    if (this._lastInterval) {
      clearInterval(this._lastInterval);
      this._lastInterval = null;
    }
  }

  play(): void {
    if (!this._isPlaying) {
      this._isPlaying = true;
      this._restartInterval();
    }
  }

  stop(): void {
    if (this._isPlaying) {
      this._isPlaying = false;
      this._resetInterval();
    }
  }

  to(index: number): void {
    if (index > this.items.length - 1 || index < 0) {
      return;
    }

    if (this.activeSlide === index) {
      this.stop();
      this.play();
      return;
    }

    const direction = index > this.activeSlide ? Direction.NEXT : Direction.PREV;

    this._animateSlides(direction, this.activeSlide, index);
    this.activeSlide = index;
  }

  next(): void {
    if (!this._isSliding) {
      this._slide(Direction.NEXT);
    }
  }

  prev(): void {
    if (!this._isSliding) {
      this._slide(Direction.PREV);
    }
  }

  private _slide(direction: Direction): void {
    const isFirst = this._activeSlide === 0;
    const isLast = this._activeSlide === this.items.length - 1;

    if (!this.wrap) {
      if ((direction === Direction.NEXT && isLast) || (direction === Direction.PREV && isFirst)) {
        return;
      }
    }

    const newSlideIndex = this._getNewSlideIndex(direction);

    this._animateSlides(direction, this.activeSlide, newSlideIndex);
    this.activeSlide = newSlideIndex;

    this.slide.emit();
  }

  private _animateSlides(direction: Direction, currentIndex: number, nextIndex: number): void {
    const currentItem = this.items[currentIndex];
    const nextItem = this.items[nextIndex];
    const currentEl = currentItem.host;
    const nextEl = nextItem.host;

    this._isSliding = true;

    if (this._isPlaying) {
      this.stop();
    }

    if (direction === Direction.NEXT) {
      nextItem.next = true;

      setTimeout(() => {
        this._reflow(nextEl);
        currentItem.start = true;
        nextItem.start = true;
        this._cdRef.markForCheck();
      }, 0);

      const transitionDuration = 600;

      fromEvent(currentEl, 'transitionend')
        .pipe(take(1))
        .subscribe(() => {
          nextItem.next = false;
          nextItem.start = false;
          nextItem.active = true;

          currentItem.active = false;
          currentItem.start = false;
          currentItem.next = false;

          this.slideChange.emit();
          this._isSliding = false;
        });

      this._emulateTransitionEnd(currentEl, transitionDuration);
    } else if (direction === Direction.PREV) {
      nextItem.prev = true;

      setTimeout(() => {
        this._reflow(nextEl);
        currentItem.end = true;
        nextItem.end = true;
        this._cdRef.markForCheck();
      }, 0);

      const transitionDuration = 600;

      fromEvent(currentEl, 'transitionend')
        .pipe(take(1))
        .subscribe(() => {
          nextItem.prev = false;
          nextItem.end = false;
          nextItem.active = true;

          currentItem.active = false;
          currentItem.end = false;
          currentItem.prev = false;

          this.slideChange.emit();
          this._isSliding = false;
        });

      this._emulateTransitionEnd(currentEl, transitionDuration);
    }

    if (!this._isPlaying && this.interval > 0) {
      this.play();
    }
  }

  private _reflow(element: HTMLElement): number {
    return element.offsetHeight;
  }

  private _emulateTransitionEnd(element: HTMLElement, duration: number): void {
    let eventEmitted = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    fromEvent(element, 'transitionend')
      .pipe(take(1))
      .subscribe(() => {
        eventEmitted = true;
      });

    setTimeout(() => {
      if (!eventEmitted) {
        element.dispatchEvent(new Event('transitionend'));
      }
    }, emulatedDuration);
  }

  private _getNewSlideIndex(direction: Direction): number {
    let newSlideIndex: number;

    if (direction === Direction.NEXT) {
      newSlideIndex = this._getNextSlideIndex();
    }

    if (direction === Direction.PREV) {
      newSlideIndex = this._getPrevSlideIndex();
    }

    return newSlideIndex;
  }

  private _getNextSlideIndex(): number {
    const isLast = this._activeSlide === this.items.length - 1;

    if (!isLast) {
      return this._activeSlide + 1;
    } else if (this.wrap && isLast) {
      return 0;
    } else {
      return this._activeSlide;
    }
  }

  private _getPrevSlideIndex(): number {
    const isFirst = this._activeSlide === 0;

    if (!isFirst) {
      return this._activeSlide - 1;
    } else if (this.wrap && isFirst) {
      return this.items.length - 1;
    } else {
      return this._activeSlide;
    }
  }

  static ngAcceptInputType_controls: BooleanInput;
  static ngAcceptInputType_dark: BooleanInput;
  static ngAcceptInputType_indicators: BooleanInput;
  static ngAcceptInputType_ride: BooleanInput;
}
