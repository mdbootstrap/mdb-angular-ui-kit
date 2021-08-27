import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  NgZone,
  Input,
  AfterViewInit,
} from '@angular/core';
import { MdbScrollspyService } from './scrollspy.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbScrollspyElement]',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MdbScrollspyElementDirective implements OnInit, AfterViewInit {
  private id: string;

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  @Input() container: HTMLElement;

  @Input('mdbScrollspyElement')
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
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private scrollSpyService: MdbScrollspyService
  ) {}

  isElementInViewport(): boolean {
    const scrollTop = this.container.scrollTop;
    const elTop = this.host.offsetTop - this.offset;
    const elHeight = this.host.offsetHeight;

    return scrollTop >= elTop && scrollTop < elTop + elHeight;
  }

  updateActiveState(scrollSpyId: string, id: string): void {
    if (this.isElementInViewport()) {
      this.scrollSpyService.removeActiveLinks(scrollSpyId);
      this.scrollSpyService.updateActiveState(scrollSpyId, id);
    }
  }

  onScroll(): void {
    this.updateActiveState(this.scrollSpyId, this.id);
  }

  listenToScroll(): void {
    this.renderer.listen(this.container, 'scroll', () => {
      this.onScroll();
    });
  }

  ngOnInit(): void {
    this.id = this.host.id;

    if (!this.container) {
      this.container = this._getClosestEl(this.host, '.scrollspy-container');
    }

    this.renderer.setStyle(this.container, 'position', 'relative');

    this.ngZone.runOutsideAngular(this.listenToScroll.bind(this));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateActiveState(this.scrollSpyId, this.id);
    }, 0);
  }

  private _getClosestEl(el: any, selector: string): HTMLElement | null {
    for (; el && el !== document; el = el.parentNode) {
      if (el.matches && el.matches(selector)) {
        return el;
      }
    }
    return null;
  }
}
