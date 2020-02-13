import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { isBs3 } from '../utils/ng2-bootstrap-config';
import { SlideComponent } from './slide.component';
import { CarouselConfig } from './carousel.config';
import { isPlatformBrowser } from '@angular/common';
import { LEFT_ARROW, RIGHT_ARROW } from '../utils/keyboard-navigation';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export enum Direction {
  UNKNOWN,
  NEXT,
  PREV,
}

/**
 * Base element to create carousel
 */
@Component({
  selector: 'mdb-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel-module.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselComponent implements OnDestroy, AfterViewInit {
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  @ContentChildren(SlideComponent) _slidesList: QueryList<SlideComponent>;
  public get slides(): SlideComponent[] {
    return this._slidesList.toArray();
  }

  private _destroy$: Subject<void> = new Subject();

  protected currentInterval: any;
  protected isPlaying: boolean;
  protected destroyed = false;

  protected animationEnd = true;
  protected _currentActiveSlide: number;
  protected carouselIndicators: any;

  isBrowser: any = false;
  @Input() public noWrap: boolean;
  @Input() public noPause: boolean;

  @Input() public isControls = true;
  @Input() public keyboard: boolean;

  @Input() public class: String = '';
  @Input() public type: String = '';
  @Input() public animation: String = '';
  @Input() activeSlideIndex: number;
  @Input() allowSwipe = true;

  @Output() public activeSlideChange: EventEmitter<any> = new EventEmitter<any>(false);

  @Input()
  public set activeSlide(index: number) {
    if (this._slidesList && index !== this._currentActiveSlide) {
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
    protected el: ElementRef,
    @Inject(PLATFORM_ID) platformId: string,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    Object.assign(this, config);
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit() {
    this.play();
    this._slidesList.changes
      .pipe(takeUntil(this._destroy$))
      .subscribe((slidesList: QueryList<SlideComponent>) => {
        this._slidesList = slidesList;
        setTimeout(() => {
          this._select(0);
        }, 0);
      });

    if (this.activeSlideIndex) {
      setTimeout(() => {
        this._select(this.activeSlideIndex);
        this.activeSlideChange.emit({ relatedTarget: this.activeSlide });
      }, 0);
    } else {
      setTimeout(() => {
        this._select(0);
      }, 0);
    }

    if (this.isControls) {
      this.carouselIndicators = this.el.nativeElement.querySelectorAll('.carousel-indicators > li');
      if (this.carouselIndicators.length && this.activeSlideIndex) {
        this.renderer.addClass(this.carouselIndicators[this.activeSlideIndex], 'active');
      } else if (this.carouselIndicators.length) {
        this.renderer.addClass(this.carouselIndicators[0], 'active');
      }
    }
  }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    if (this.allowSwipe) {
      if (action === this.SWIPE_ACTION.RIGHT) {
        this.previousSlide();
        this.cdRef.markForCheck();
      }

      if (action === this.SWIPE_ACTION.LEFT) {
        this.nextSlide();
        this.cdRef.markForCheck();
      }
    }
  }

  public nextSlide(force: boolean = false) {
    this.restartTimer();
    // Start next slide, pause actual slide
    const videoList = this.el.nativeElement.getElementsByTagName('video');
    const direction = Direction.NEXT;
    const indexEl = this.findNextSlideIndex(direction, force);
    if (videoList.length > 0) {
      // Check for video carousel
      for (let i = 0; i < videoList.length; i++) {
        if (i === indexEl) {
          videoList[i].play();
        } else {
          videoList[i].pause();
        }
      }
    }
    if (this.animation === 'slide') {
      this.pause();
      this.slideAnimation(this.findNextSlideIndex(Direction.NEXT, force), Direction.NEXT);
      this.cdRef.markForCheck();
    } else if (this.animation === 'fade') {
      this.pause();
      this.fadeAnimation(this.findNextSlideIndex(Direction.NEXT, force), Direction.NEXT);
      this.cdRef.markForCheck();
    } else {
      this.activeSlide = this.findNextSlideIndex(Direction.NEXT, force);
      this.cdRef.markForCheck();
    }
    if (!this.animation) {
      this.activeSlideChange.emit({ direction: 'Next', relatedTarget: this.activeSlide });
    }
  }

  public previousSlide(force: boolean = false): void {
    this.restartTimer();
    // Start previous slide, pause actual slide
    const videoList = this.el.nativeElement.getElementsByTagName('video');
    const direction = Direction.PREV;
    const indexel = this.findNextSlideIndex(direction, force);
    if (videoList.length > 0) {
      // Check for video carousel
      for (let i = 0; i < videoList.length; i++) {
        if (i === indexel) {
          videoList[i].play();
        } else {
          videoList[i].pause();
        }
      }
    }

    if (this.animation === 'slide') {
      this.pause();
      this.slideAnimation(this.findNextSlideIndex(direction, force), direction);
      this.cdRef.markForCheck();
    } else if (this.animation === 'fade') {
      this.pause();
      this.fadeAnimation(this.findNextSlideIndex(Direction.PREV, force), Direction.PREV);
      this.cdRef.markForCheck();
    } else {
      this.activeSlide = this.findNextSlideIndex(Direction.PREV, force);
      this.cdRef.markForCheck();
    }
    if (!this.animation) {
      this.activeSlideChange.emit({ direction: 'Prev', relatedTarget: this.activeSlide });
    }
  }

  protected fadeAnimation(goToIndex: number, direction?: any) {
    const goToSlide = this.slides[goToIndex];

    if (this.animationEnd) {
      this.animationEnd = false;

      goToSlide.directionNext = true;
      if (this.isBrowser) {
        setTimeout(() => {
          const previous = this.slides[this._currentActiveSlide].el.nativeElement;

          this.renderer.setStyle(previous, 'opacity', '0');
          this.renderer.setStyle(previous, 'transition', 'all 600ms');
          this.renderer.setStyle(previous, 'display', 'block');

          this.renderer.setStyle(goToSlide.el.nativeElement, 'display', 'block');
          this.renderer.setStyle(goToSlide.el.nativeElement, 'opacity', '1');
          this.renderer.setStyle(goToSlide.el.nativeElement, 'transition', 'all 600ms');

          if (direction === 1) {
            this.activeSlideChange.emit({ direction: 'Next', relatedTarget: this.activeSlide });
          } else if (direction === 2) {
            this.activeSlideChange.emit({ direction: 'Prev', relatedTarget: this.activeSlide });
          }

          goToSlide.directionNext = false;
          this.animationEnd = true;
          this.activeSlide = goToIndex;
          this.activeSlideChange.emit({ direction: 'Next', relatedTarget: this.activeSlide });
          this.play();
          this.cdRef.markForCheck();
        }, 0);
      }
    }
  }

  protected slideAnimation(goToIndex: number, direction: any) {
    const currentSlide = this.slides[this._currentActiveSlide];
    const goToSlide = this.slides[goToIndex];

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

          this.activeSlideChange.emit({
            direction: directionName,
            relatedTarget: this.activeSlide,
          });
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
    } else if (!this.animation) {
      setTimeout(() => {
        const direction = index < this.activeSlide ? 'Prev' : 'Next';
        this._select(index);
        this.activeSlideChange.emit({
          direction,
          relatedTarget: this.activeSlide,
        });
      }, 0);
    }
    this.play();
  }

  @HostListener('mouseleave') play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.restartTimer();
      this.cdRef.markForCheck();
    }
  }

  @HostListener('mouseenter') pause() {
    if (!this.noPause) {
      this.isPlaying = false;
      this.resetTimer();
      this.cdRef.markForCheck();
    }
  }

  public getCurrentSlideIndex(): number {
    return this.slides.findIndex((slide: SlideComponent) => slide.active);
  }

  public isLast(index: number): boolean {
    return index + 1 >= this.slides.length;
  }

  private findNextSlideIndex(direction: Direction, force: boolean): any {
    let nextSlideIndex = 0;

    if (!force && (this.isLast(this.activeSlide) && direction !== Direction.PREV && this.noWrap)) {
      return void 0;
    }

    switch (direction) {
      case Direction.NEXT:
        nextSlideIndex = !this.isLast(this._currentActiveSlide)
          ? this._currentActiveSlide + 1
          : !force && this.noWrap
          ? this._currentActiveSlide
          : 0;
        break;
      case Direction.PREV:
        nextSlideIndex =
          this._currentActiveSlide > 0
            ? this._currentActiveSlide - 1
            : !force && this.noWrap
            ? this._currentActiveSlide
            : this.slides.length - 1;
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
    const currentSlide = this.slides[this._currentActiveSlide];
    if (currentSlide) {
      currentSlide.active = false;
    }
    const nextSlide = this.slides[index];
    if (nextSlide) {
      this._currentActiveSlide = index;
      nextSlide.active = true;
      this.activeSlide = index;
    }
    this.cdRef.markForCheck();
  }

  private restartTimer(): any {
    this.resetTimer();
    if (this.isBrowser) {
      const interval = +this.interval;
      if (!isNaN(interval) && interval > 0) {
        this.currentInterval = setInterval(() => {
          const nInterval = +this.interval;
          if (this.isPlaying && !isNaN(this.interval) && nInterval > 0 && this.slides.length) {
            this.nextSlide();
          } else {
            this.pause();
          }
        }, interval);
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
      // tslint:disable-next-line: deprecation
      if (event.keyCode === RIGHT_ARROW) {
        this.nextSlide();
      }

      // tslint:disable-next-line: deprecation
      if (event.keyCode === LEFT_ARROW) {
        this.previousSlide();
      }
    }
  }

  @HostListener('click') focus() {
    this.el.nativeElement.focus();
  }
}
