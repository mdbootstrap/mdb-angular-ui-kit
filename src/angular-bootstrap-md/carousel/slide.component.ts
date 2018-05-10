import { Component, HostBinding, OnDestroy, Input, OnInit, ElementRef } from '@angular/core';

import { CarouselComponent } from './carousel.component';

@Component({
  selector: 'mdb-slide',
  template: `
  <ng-content></ng-content>
  `
})
export class SlideComponent implements OnInit, OnDestroy {

  /** Is current slide active */
  @HostBinding('class.active')
  @Input() public active: boolean;
  @HostBinding('class.animated') animated = false;
  @HostBinding('class.carousel-item-next') directionNext = false;
  @HostBinding('class.carousel-item-left') directionLeft = false;
  @HostBinding('class.carousel-item-prev') directionPrev = false;
  @HostBinding('class.carousel-item-right') directionRight = false;
  /** Wraps element by appropriate CSS classes */
  @HostBinding('class.carousel-item')


  /** Link to Parent(container-collection) component */
  protected carousel: CarouselComponent;
  // public el: ElementRef = null;
  public el: ElementRef | any = null;

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
