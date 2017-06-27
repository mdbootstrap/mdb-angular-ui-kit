import { Component, HostBinding, OnDestroy, Input, OnInit, ElementRef } from '@angular/core';

import { CarouselComponent } from './carouselComponent';

@Component({
  selector: 'slide',
  host: {
    '[class.animated]': 'animated'
  },
  template: `
    <ng-content></ng-content>
  `
})
export class SlideComponent implements OnInit, OnDestroy {

  /** Is current slide active */
  @HostBinding('class.active')
  @Input() public active:boolean;
  private animated: boolean = true;

  /** Wraps element by appropriate CSS classes */
  @HostBinding('class.carousel-item')
  

  /** Link to Parent(container-collection) component */
  protected carousel:CarouselComponent;
  public el:ElementRef = null;

  public constructor(carousel:CarouselComponent, el: ElementRef) {
    this.carousel = carousel;
    this.el = el;
  }

  /** Fires changes in container collection after adding a new slide instance */
  public ngOnInit():void {
    this.carousel.addSlide(this);
  }

  /** Fires changes in container collection after removing of this slide instance */
  public ngOnDestroy():void {
    this.carousel.removeSlide(this);
  }
}