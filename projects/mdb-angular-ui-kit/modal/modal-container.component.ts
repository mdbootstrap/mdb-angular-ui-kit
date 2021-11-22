import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MdbModalConfig } from './modal-config';
import { ConfigurableFocusTrapFactory, ConfigurableFocusTrap } from '@angular/cdk/a11y';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'mdb-modal-container',
  templateUrl: 'modal-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MdbModalContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;
  @ViewChild('dialog', { static: true }) modalDialog: ElementRef;

  readonly _destroy$: Subject<void> = new Subject<void>();
  readonly backdropClick$: Subject<MouseEvent> = new Subject<MouseEvent>();

  _config: MdbModalConfig;

  BACKDROP_TRANSITION = 150;
  MODAL_TRANSITION = 200;

  private _previouslyFocusedElement: HTMLElement;
  private _focusTrap: ConfigurableFocusTrap;

  @HostBinding('class.modal') modal = true;
  @HostBinding('class.fade')
  get hasAnimation(): boolean {
    return this._config.animation;
  }

  constructor(
    @Inject(DOCUMENT) private _document,
    public _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _focusTrapFactory: ConfigurableFocusTrapFactory
  ) {}

  ngOnInit(): void {
    this._updateContainerClass();
    this._renderer.addClass(this._document.body, 'modal-open');
    this._renderer.setStyle(this._document.body, 'padding-right', '15px');
    this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'block');
    this._previouslyFocusedElement = this._document.activeElement as HTMLElement;
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);

    if (this._config.animation) {
      setTimeout(() => {
        this._renderer.addClass(this._elementRef.nativeElement, 'show');

        setTimeout(() => {
          this._focusTrap.focusInitialElementWhenReady();
        }, this.MODAL_TRANSITION);
      }, this.BACKDROP_TRANSITION);
    } else {
      this._focusTrap.focusInitialElementWhenReady();
    }
  }

  ngAfterViewInit(): void {
    if (!this._config.ignoreBackdropClick) {
      fromEvent(this._elementRef.nativeElement, 'mousedown')
        .pipe(
          filter((event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const dialog = this.modalDialog.nativeElement;
            const notDialog = target !== dialog;
            const notDialogContent = !dialog.contains(target);
            return notDialog && notDialogContent;
          }),
          takeUntil(this._destroy$)
        )
        .subscribe((event: MouseEvent) => {
          this.backdropClick$.next(event);
        });
    }
  }

  ngOnDestroy(): void {
    this._previouslyFocusedElement.focus();
    this._focusTrap.destroy();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateContainerClass(): void {
    if (
      this._config.containerClass === '' ||
      (this._config.containerClass.length && this._config.containerClass.length === 0)
    ) {
      return;
    }

    const containerClasses = this._config.containerClass.split(' ');

    containerClasses.forEach((containerClass) => {
      this._renderer.addClass(this._elementRef.nativeElement, containerClass);
    });
  }

  _close(): void {
    if (this._config.animation) {
      this._renderer.removeClass(this._elementRef.nativeElement, 'show');
    }

    // Pause iframe/video when closing modal
    const iframeElements = Array.from(this._elementRef.nativeElement.querySelectorAll('iframe'));
    const videoElements = Array.from(this._elementRef.nativeElement.querySelectorAll('video'));

    iframeElements.forEach((iframe: HTMLIFrameElement) => {
      const srcAttribute: any = iframe.getAttribute('src');
      this._renderer.setAttribute(iframe, 'src', srcAttribute);
    });

    videoElements.forEach((video: HTMLVideoElement) => {
      video.pause();
    });
  }

  _restoreScrollbar(): void {
    this._renderer.removeClass(this._document.body, 'modal-open');
    this._renderer.removeStyle(this._document.body, 'padding-right');
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }
}
