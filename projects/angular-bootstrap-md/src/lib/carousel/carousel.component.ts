import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import {isBs3} from '../utils/ng2-bootstrap-config';
import {LinkedList} from '../utils/linked-list.class';
import {SlideComponent} from './slide.component';
import {CarouselConfig} from './carousel.config';
import {isPlatformBrowser} from '@angular/common';

export enum Direction { UNKNOWN, NEXT, PREV }

/**
 * Base element to create carousel
 */
@Component({
  selector: 'mdb-carousel',
  templateUrl: './carousel.component.html'
})

export class CarouselComponent implements OnDestroy, AfterViewInit {
  SWIPE_ACTION = {LEFT: 'swipeleft', RIGHT: 'swiperight'};

  protected _slides: LinkedList<SlideComponent> = new LinkedList<SlideComponent>();
  public get slides(): SlideComponent[] {
    return this._slides.toArray();
  }

  protected currentInterval: any;
  protected isPlaying: boolean;
  protected destroyed = false;
  protected el: ElementRef | any = null;
  protected animationEnd = true;
  protected _currentActiveSlide: number | any;

  isBrowser: any = false;
  @Input() public noWrap: boolean;
  @Input() public noPause: boolean;

  @Input('isControls') public isControls = true;
  @Input() public keyboard: boolean;

  @Input('class') public class: String = '';
  @Input('type') public type: String = '';
  @Input('animation') public animation: String = '';
  @Input() activeSlideIndex: number;


  @Output() public activeSlideChange: EventEmitter<any> = new EventEmitter<any>(false);

  @Input()
  public set activeSlide(index: number) {
    if (this._slides.length && index !== this._currentActiveSlide) {
      this._select(index);
    }
  }

  public get activeSlide(): number {
    return this._currentActiveSlide;
  }

  protected _interval: number;

  public checkNavigation() {
    if (this.type === 'carousel-multi-item') {
      return false;
    }
    return true;
  }

  public checkDots() {
    if (this.type === 'carousel-thumbnails') {
      return false;
    }
    return true;
  }

  getImg(slide: any) {
    return slide.el.nativeElement.querySelector('img').src;
  }

  @Input()
  public get interval(): number {
    return this._interval;
  }

  public set interval(value: number) {
    this._interval = value;
    this.restartTimer();
  }

  public get isBs4(): boolean {
    return !isBs3();
  }

  public constructor(
    config: CarouselConfig,
    el: ElementRef,
    @Inject(PLATFORM_ID) platformId: string,
    private cdRef: ChangeDetectorRef) {
    this.isBrowser = isPlatformBrowser(platformId);
    Object.assign(this, config);
    this.el = el;
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
  }

  public addSlide(slide: SlideComponent): void {
    this._slides.add(slide);
    if (this._slides.length === 1) {
      this._currentActiveSlide = void 0;
      this.activeSlide = 0;
      this.play();
    }
  }

  ngAfterViewInit() {
    if (this.activeSlideIndex) {
      setTimeout(() => {
        this._select(this.activeSlideIndex);
        this.activeSlideChange.emit({'relatedTarget': this.activeSlide});
      }, 0);
    }
  }

  public removeSlide(slide: SlideComponent): void {
    const remIndex = this._slides.indexOf(slide);

    if (this._currentActiveSlide === remIndex) {

      let nextSlideIndex: number | any = void 0;
      if (this._slides.length > 1) {
        nextSlideIndex = !this.isLast(remIndex) ? remIndex :
          this.noWrap ? remIndex - 1 : 0;
      }
      this._slides.remove(remIndex);

      setTimeout(() => {
        this._select(nextSlideIndex);
      }, 0);
    } else {
      this._slides.remove(remIndex);
      const currentSlideIndex = this.getCurrentSlideIndex();
      setTimeout(() => {
        this._currentActiveSlide = currentSlideIndex;
        this.activeSlideChange.emit(this._currentActiveSlide);
      }, 0);

    }
  }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.previousSlide();
      this.cdRef.markForCheck();
    }

    if (action === this.SWIPE_ACTION.LEFT) {
      this.nextSlide();
      this.cdRef.markForCheck();
    }
  }

  public nextSlide(force: boolean = false) {
    if (this.animation === 'slide') {
      this.pause();
      const direction = Direction.NEXT;
      this.slideAnimation(this.findNextSlideIndex(direction, force), direction);
      this.cdRef.markForCheck();
    } else if (this.animation === 'fade') {
      this.pause();
      this.fadeAnimation(this.findNextSlideIndex(Direction.NEXT, force));
      this.cdRef.markForCheck();
    } else {
      this.activeSlide = this.findNextSlideIndex(Direction.NEXT, force);
      this.cdRef.markForCheck();
    }
    if (!this.animation) {
      this.activeSlideChange.emit({'direction': 'Next', 'relatedTarget': this.activeSlide});
    }
  }

  public previousSlide(force: boolean = false): void {
    if (this.animation === 'slide') {
      this.pause();
      const direction = Direction.PREV;
      this.slideAnimation(this.findNextSlideIndex(direction, force), direction);
      this.cdRef.markForCheck();
    } else if (this.animation === 'fade') {
      this.pause();
      this.fadeAnimation(this.findNextSlideIndex(Direction.PREV, force));
      this.cdRef.markForCheck();
    } else {
      this.activeSlide = this.findNextSlideIndex(Direction.PREV, force);
      this.cdRef.markForCheck();
    }
    if (!this.animation) {
      this.activeSlideChange.emit({'direction': 'Prev', 'relatedTarget': this.activeSlide});
    }
  }

  protected fadeAnimation(goToIndex: number) {
    const goToSlide = this._slides.get(goToIndex);

    if (this.animationEnd) {
      this.animationEnd = false;

      goToSlide.directionNext = true;
      if (this.isBrowser) {
        setTimeout(() => {
          goToSlide.directionNext = false;
          this.animationEnd = true;
          this.activeSlide = goToIndex;
          this.activeSlideChange.emit({'direction': 'Next', 'relatedTarget': this.activeSlide});
          this.play();
          this.cdRef.markForCheck();
        }, 0);
      }
    }
  }

  protected slideAnimation(goToIndex: number, direction: any) {

    const currentSlide = this._slides.get(this._currentActiveSlide);
    const goToSlide = this._slides.get(goToIndex);

    if (this.animationEnd) {
      if (direction === Direction.NEXT) {
        this.animationEnd = false;
        goToSlide.directionNext = true;
        if (this.isBrowser) {
          setTimeout(() => {
            goToSlide.directionLeft = true;
            currentSlide.directionLeft = true;
            this.cdRef.markForCheck();
          }, 100);
        }
      }

      if (direction === Direction.PREV) {
        this.animationEnd = false;

        goToSlide.directionPrev = true;
        if (this.isBrowser) {
          setTimeout(() => {
            goToSlide.directionRight = true;
            currentSlide.directionRight = true;
            this.cdRef.markForCheck();
          }, 100);
        }
      }

      if (this.isBrowser) {
        setTimeout(() => {
          goToSlide.directionLeft = false;
          goToSlide.directionNext = false;
          currentSlide.directionLeft = false;
          currentSlide.directionNext = false;
          goToSlide.directionRight = false;
          goToSlide.directionPrev = false;
          currentSlide.directionRight = false;
          currentSlide.directionPrev = false;

          this.animationEnd = true;

          this.activeSlide = goToIndex;

          let directionName;
          if (direction === Direction.NEXT) {
            directionName = 'Next';
          } else if (direction === Direction.PREV) {
            directionName = 'Prev';
          }

          this.activeSlideChange.emit({'direction': directionName, 'relatedTarget': this.activeSlide});
          this.play();
          this.cdRef.markForCheck();
        }, 700);
      }
    }
  }

  public selectSlide(index: number): void {
    this.pause();
    if (this.animation === 'slide') {

      if (this.activeSlide < index) {
        this.slideAnimation(index, Direction.NEXT);
      } else if (this.activeSlide > index) {
        this.slideAnimation(index, Direction.PREV);
      }
    } else if (this.animation === 'fade') {
      if (index !== this.activeSlide) {
        this.fadeAnimation(index);
      }
    }
    this.play();
  }

  @HostListener('mouseleave') play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.restartTimer();
    }
  }

  @HostListener('mouseenter') pause() {
    if (!this.noPause) {
      this.isPlaying = false;
      this.resetTimer();
    }
  }

  public getCurrentSlideIndex(): number {
    return this._slides.findIndex((slide: SlideComponent) => slide.active);
  }

  public isLast(index: number): boolean {
    return index + 1 >= this._slides.length;
  }

  private findNextSlideIndex(direction: Direction, force: boolean): any {
    let nextSlideIndex = 0;

    if (!force && (this.isLast(this.activeSlide) && direction !== Direction.PREV && this.noWrap)) {
      return void 0;
    }

    switch (direction) {
      case Direction.NEXT:
        nextSlideIndex = (!this.isLast(this._currentActiveSlide)) ? this._currentActiveSlide + 1 :
          (!force && this.noWrap) ? this._currentActiveSlide : 0;
        break;
      case Direction.PREV:
        nextSlideIndex = (this._currentActiveSlide > 0) ? this._currentActiveSlide - 1 :
          (!force && this.noWrap) ? this._currentActiveSlide : this._slides.length - 1;
        break;
      default:
        throw new Error('Unknown direction');
    }
    return nextSlideIndex;
  }

  private _select(index: number): void {
    if (isNaN(index)) {
      this.pause();
      return;
    }
    const currentSlide = this._slides.get(this._currentActiveSlide);
    if (currentSlide) {
      currentSlide.active = false;
    }
    const nextSlide = this._slides.get(index);
    if (nextSlide) {
      this._currentActiveSlide = index;
      nextSlide.active = true;
      this.activeSlide = index;
    }
  }

  private restartTimer(): any {
    this.resetTimer();
    if (this.isBrowser) {
      const interval = +this.interval;
      if (!isNaN(interval) && interval > 0) {
        this.currentInterval = setInterval(
          () => {
            const nInterval = +this.interval;
            if (this.isPlaying && !isNaN(this.interval) && nInterval > 0 && this.slides.length) {
              this.nextSlide();
            } else {
              this.pause();
            }
          },
          interval);
      }
    }
  }

  private resetTimer(): void {
    if (this.isBrowser) {
      if (this.currentInterval) {
        clearInterval(this.currentInterval);
        this.currentInterval = void 0;
      }
    }

  }

  protected hasClass(el: any, className: any) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
  }

  protected classAdd(el: any, className: any) {
    if (el.classList) {
      el.classList.add(className);
    } else if (!this.hasClass(el, className)) {
      el.className += ' ' + className;
    }
  }

  protected removeClass(el: any, className: any) {
    if (el.classList) {
      el.classList.remove(className);
    } else if (this.hasClass(el, className)) {
      const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }

  @HostListener('keyup', ['$event']) keyboardControl(event: KeyboardEvent) {
    if (this.keyboard) {
      if (event.keyCode === 39) {
        this.nextSlide();
      }

      if (event.keyCode === 37) {
        this.previousSlide();
      }
    }
  }

  @HostListener('click') focus() {
    this.el.nativeElement.focus();
  }
}
