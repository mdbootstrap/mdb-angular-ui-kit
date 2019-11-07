import { Component, HostBinding, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'mdb-slide, mdb-carousel-item',
  template: `
    <ng-content></ng-content>
  `,
})
export class SlideComponent {
  /** Is current slide active */
  @HostBinding('class.active')
  @Input()
  public active: boolean;
  @HostBinding('class.animated') animated = false;
  @HostBinding('class.carousel-item-next') directionNext = false;
  @HostBinding('class.carousel-item-left') directionLeft = false;
  @HostBinding('class.carousel-item-prev') directionPrev = false;
  @HostBinding('class.carousel-item-right') directionRight = false;
  /** Wraps element by appropriate CSS classes */
  @HostBinding('class.carousel-item')

  /** Link to Parent(container-collection) component */
  public el: ElementRef | any = null;

  public constructor(el: ElementRef) {
    this.el = el;
  }
}
