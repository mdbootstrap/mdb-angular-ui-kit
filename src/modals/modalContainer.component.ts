import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer, HostBinding } from '@angular/core';
import { ClassName, DISMISS_REASONS, ModalOptions, TransitionDurations } from './modal.options';
import { isBs3 } from '../utils/ng2-bootstrap-config';
import { msConfig } from './modalService.config';

@Component({
  selector: 'mdb-modal-container',
  template: `
  <div [class]="'modal-dialog' + (config.class ? ' ' + config.class : '')" role="document">
  <div class="modal-content"><ng-content></ng-content></div>
</div>`
})
export class ModalContainerComponent implements OnInit, OnDestroy {
  @HostBinding('tabindex') tabindex = -1;
  @HostBinding('role') role = 'dialog';
  @HostBinding('class.modal') modla = true;

  private mdbModalService: any;

  public config: ModalOptions;
  public isShown = false;
  public level: number;
  public isAnimated: boolean;
  protected _element: ElementRef;
  private isModalHiding = false;
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    if (this.config.ignoreBackdropClick || this.config.backdrop === 'static' || event.target !== this._element.nativeElement) {
      return;
    }
    this.mdbModalService.setDismissReason(DISMISS_REASONS.BACKRDOP);
    this.hide();
  }
  @HostListener('window:keydown.esc')
  public onEsc(): void {
    if (this.config.keyboard && this.level === this.mdbModalService.getModalsCount()) {
      this.mdbModalService.setDismissReason(DISMISS_REASONS.ESC);
      this.hide();
    }
  }

  public constructor(options: ModalOptions, _element: ElementRef, private _renderer: Renderer) {
    this.mdbModalService = msConfig.serviceInstance;

    this._element = _element;
    this.config = Object.assign({}, options);
  }

  ngOnInit(): void {
    if (this.isAnimated) {
      this._renderer.setElementClass(this._element.nativeElement, ClassName.FADE, true);
    }
    this._renderer.setElementStyle(this._element.nativeElement, 'display', 'block');
    setTimeout(() => {
      this.isShown = true;
      this._renderer.setElementClass(this._element.nativeElement, isBs3() ? ClassName.IN : ClassName.SHOW, true);
    }, this.isAnimated ? TransitionDurations.BACKDROP : 0);
    if (document && document.body) {
      if (this.mdbModalService.getModalsCount() === 1) {
        this.mdbModalService.checkScrollbar();
        this.mdbModalService.setScrollbar();
      }
      this._renderer.setElementClass(document.body, ClassName.OPEN, true);
    }
  }

  ngOnDestroy(): void {
    if (this.isShown) {
      this.hide();
    }
  }

  hide(): void {
    if (this.isModalHiding || !this.isShown) {
      return;
    }
    this.isModalHiding = true;
    this._renderer.setElementClass(this._element.nativeElement, isBs3() ? ClassName.IN : ClassName.SHOW, false);

    setTimeout(() => {
      this.isShown = false;
      if (document && document.body && this.mdbModalService.getModalsCount() === 1) {
        this._renderer.setElementClass(document.body, ClassName.OPEN, false);
      }
      this.mdbModalService.hide(this.level);
      this.isModalHiding = false;
    }, this.isAnimated ? TransitionDurations.MODAL : 0);
  }
}
