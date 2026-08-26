import { Component, ElementRef, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mdb-carousel-item',
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve Angular 21 behavior.
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MdbCarouselItemComponent {
  @Input() interval: number | null = null;

  @HostBinding('class.carousel-item')
  carouselItem = true;

  @HostBinding('class.active') active = false;

  @HostBinding('class.carousel-item-next') next = false;
  @HostBinding('class.carousel-item-prev') prev = false;
  @HostBinding('class.carousel-item-start') start = false;
  @HostBinding('class.carousel-item-end') end = false;

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  constructor(private _elementRef: ElementRef) {}
}
