import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { window } from '../utils/facade/browser';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  skip,
  throttleTime,
  takeUntil,
} from 'rxjs/operators';

enum Direction {
  Up = 'Up',
  Down = 'Down',
}

@Directive({
  selector: '[mdbStickyHeader]',
  exportAs: 'mdbStickyHeader',
})
export class StickyHeaderDirective implements AfterViewInit, OnDestroy {
  @Input() animationDuration = 200;
  @Output() transitionEnd: EventEmitter<{ state: string }> = new EventEmitter<{ state: string }>();

  private _destroy$: Subject<void> = new Subject();

  private scrollDown$: any;
  private scrollUp$: any;

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  ngAfterViewInit() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(10),
      map(() => window.pageYOffset),
      pairwise(),
      map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
      distinctUntilChanged(),
      share()
    );

    this.scrollUp$ = scroll$.pipe(filter(direction => direction === Direction.Up));
    this.scrollDown$ = scroll$.pipe(filter(direction => direction === Direction.Down));

    this._renderer.setStyle(this._el.nativeElement, 'position', 'fixed');
    this._renderer.setStyle(this._el.nativeElement, 'top', '0');
    this._renderer.setStyle(this._el.nativeElement, 'width', '100%');
    this._renderer.setStyle(this._el.nativeElement, 'z-index', '1030');

    setTimeout(() => {
      this.scrollUp$
        .pipe(
          skip(0),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          this._renderer.setStyle(
            this._el.nativeElement,
            'transition',
            `all ${this.animationDuration}ms ease-in`
          );
          this._renderer.setStyle(this._el.nativeElement, 'transform', 'translateY(0%)');
          this.transitionEnd.emit({ state: 'Visible' });
        });
      this.scrollDown$
        .pipe(
          skip(0),
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          this._renderer.setStyle(
            this._el.nativeElement,
            'transition',
            `all ${this.animationDuration}ms ease-in`
          );
          this._renderer.setStyle(this._el.nativeElement, 'transform', 'translateY(-100%)');
          this.transitionEnd.emit({ state: 'Hidden' });
        });
    }, 0);
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
