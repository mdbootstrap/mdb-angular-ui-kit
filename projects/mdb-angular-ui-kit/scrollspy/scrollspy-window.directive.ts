import {
  Directive,
  ElementRef,
  OnInit,
  Inject,
  Renderer2,
  NgZone,
  Input,
  AfterViewInit,
  OnDestroy,
  DOCUMENT,
} from '@angular/core';

import { MdbScrollspyService } from './scrollspy.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbScrollspyWindow]',
  standalone: false,
})
export class MdbScrollspyWindowDirective implements OnInit, AfterViewInit, OnDestroy {
  private id: string;
  private _unlisten: (() => void) | null = null;
  private _lastInView: boolean | null = null;

  @Input('mdbScrollspyWindow')
  get scrollSpyId(): string {
    return this._scrollSpyId;
  }
  set scrollSpyId(newId: string) {
    if (newId) {
      this._scrollSpyId = newId;
    }
  }
  private _scrollSpyId: string;

  @Input() offset = 0;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private scrollSpyService: MdbScrollspyService
  ) {}

  isElementInViewport(): boolean {
    const scrollTop = this.document.documentElement.scrollTop || this.document.body.scrollTop;
    const elHeight = this.el.nativeElement.offsetHeight;
    const elTop = this.el.nativeElement.offsetTop - this.offset;
    const elBottom = elTop + elHeight;

    return scrollTop >= elTop && scrollTop <= elBottom;
  }

  updateActiveState(scrollSpyId: string, id: string): void {
    if (this.isElementInViewport()) {
      this.scrollSpyService.updateActiveState(scrollSpyId, id);
    } else {
      this.scrollSpyService.removeActiveState(scrollSpyId, id);
    }
  }

  onScroll(): void {
    const inView = this.isElementInViewport();

    if (this._lastInView === inView) {
      return;
    }

    this._lastInView = inView;

    this.ngZone.run(() => {
      this.updateActiveState(this.scrollSpyId, this.id);
    });
  }

  listenToScroll(): void {
    this._unlisten = this.renderer.listen(window, 'scroll', () => {
      this.onScroll();
    });
  }

  ngOnInit(): void {
    this.id = this.el.nativeElement.id;

    this.ngZone.runOutsideAngular(this.listenToScroll.bind(this));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._lastInView = this.isElementInViewport();
      this.ngZone.run(() => {
        this.updateActiveState(this.scrollSpyId, this.id);
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this._unlisten?.();
  }
}
