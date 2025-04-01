import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
} from '@angular/core';
import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';
import { MdbScrollspyService } from './scrollspy.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { isPlatformBrowser } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mdbScrollspy]',
  template: '<ng-content></ng-content>',
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbScrollspyDirective implements OnInit, AfterContentInit, OnDestroy {
  @ContentChildren(MdbScrollspyLinkDirective, { descendants: true })
  links: QueryList<MdbScrollspyLinkDirective>;

  readonly _destroy$: Subject<void> = new Subject<void>();

  @Input('mdbScrollspy')
  get id(): string {
    return this._id;
  }

  set id(newId: string) {
    if (newId) {
      this._id = newId;
    }
  }

  private _id: string;

  @Input()
  get collapsible(): boolean {
    return this._collapsible;
  }
  set collapsible(value: boolean) {
    this._collapsible = coerceBooleanProperty(value);
  }

  private _collapsible = false;

  private _isBrowser: boolean;

  @Output() activeLinkChange: EventEmitter<any> = new EventEmitter<any>();

  activeSub: Subscription;

  constructor(
    private scrollSpyService: MdbScrollspyService,
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this._isBrowser = isPlatformBrowser(platformId);
  }

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  collapsibleElementHeight = 0;

  ngOnInit(): void {
    if (this._isBrowser) {
      this.collapsibleElementHeight = this.host.getBoundingClientRect().height;
    }

    this.activeSub = this.scrollSpyService.active$
      .pipe(takeUntil(this._destroy$), distinctUntilChanged())
      .subscribe((activeLink) => {
        this.activeLinkChange.emit(activeLink);
        if (this.collapsible) {
          this.styleCollapsibleElement();
        }
      });
  }

  ngAfterContentInit(): void {
    this.scrollSpyService.addScrollspy({ id: this.id, links: this.links });
  }

  ngOnDestroy(): void {
    this.scrollSpyService.removeScrollspy(this.id);
    this._destroy$.next();
    this._destroy$.complete();
  }

  private styleCollapsibleElement(): void {
    this._renderer.setStyle(this.host, 'overflow', 'hidden');
    this._renderer.setStyle(this.host, 'transition', 'height 0.2s ease-in-out');
    this._renderer.setStyle(this.host, 'flex-wrap', 'nowrap');

    const hostSiblings = this.getAllSiblings(this.host);
    const isAnySiblingActive = hostSiblings.some((element) => {
      return element.classList.contains('active');
    });

    if (this.collapsible && isAnySiblingActive) {
      this._renderer.setStyle(this.host, 'height', `${this.collapsibleElementHeight}px`);
    } else if (this.collapsible && !isAnySiblingActive) {
      this._renderer.setStyle(this.host, 'height', '0px');
    }
  }

  private getAllSiblings(element: HTMLElement) {
    let siblings = [];
    if (!element.parentNode) {
      return siblings;
    }
    let sibling = element.parentNode.firstElementChild;
    do {
      if (sibling != element) {
        siblings.push(sibling);
      }
    } while ((sibling = sibling.nextElementSibling));
    return siblings;
  }
}
