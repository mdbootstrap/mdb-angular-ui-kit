import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { window } from '../utils/facade/browser';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  share,
  skip,
  throttleTime,
} from 'rxjs/operators';

enum Direction {
  Up = 'Up',
  Down = 'Down',
}

@Directive({
  selector: '[mdbStickyHeader]',
  exportAs: 'mdbStickyHeader',
})
export class StickyHeaderDirective implements AfterViewInit {
  @Input() animationDuration = 200;
  @Output() transitionEnd: EventEmitter<{ state: string }> = new EventEmitter<{ state: string }>();

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

    setTimeout(() => {
      this.scrollUp$.pipe(skip(0)).subscribe(() => {
        this._renderer.setStyle(
          this._el.nativeElement,
          'transition',
          `all ${this.animationDuration}ms ease-in`
        );
        this._renderer.setStyle(this._el.nativeElement, 'transform', 'translateY(0%)');
        this.transitionEnd.emit({ state: 'Visible' });
      });
      this.scrollDown$.pipe(skip(0)).subscribe(() => {
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
}
