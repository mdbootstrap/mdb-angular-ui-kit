import { Component, HostBinding, OnDestroy, Input, OnInit, ElementRef } from '@angular/core';

import { CarouselComponent } from './carouselComponent';

@Component({
  selector: 'slide',
  host: {
    '[class.animated]': 'animated',
    '[class.carousel-item-next]': 'directionNext',
    '[class.carousel-item-left]': 'directionLeft',
    '[class.carousel-item-prev]': 'directionPrev',
    '[class.carousel-item-right]': 'directionRight',
  },
  template: `
    <ng-content></ng-content>
  `
})
export class SlideComponent implements OnInit, OnDestroy {

  /** Is current slide active */
  @HostBinding('class.active')
  @Input() public active: boolean;
  public animated = false;

  public directionNext = false;
  public directionLeft = false;
  public directionPrev = false;
  public directionRight = false;

  /** Wraps element by appropriate CSS classes */
  @HostBinding('class.carousel-item')


  /** Link to Parent(container-collection) component */
  protected carousel: CarouselComponent;
  public el: ElementRef = null;

  public constructor(carousel: CarouselComponent, el: ElementRef) {
    this.carousel = carousel;
    this.el = el;
  }

  /** Fires changes in container collection after adding a new slide instance */
  public ngOnInit(): void {
    this.carousel.addSlide(this);
  }

  /** Fires changes in container collection after removing of this slide instance */
  public ngOnDestroy(): void {
    this.carousel.removeSlide(this);
  }
}