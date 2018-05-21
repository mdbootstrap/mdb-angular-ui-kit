import { ComponentRef, Injectable, TemplateRef, EventEmitter, Renderer2, ViewContainerRef, ElementRef } from '@angular/core';

import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ModalBackdropComponent } from './modalBackdrop.component';
import { ModalContainerComponent } from './modalContainer.component';
import { MDBModalRef, ClassName, modalConfigDefaults, ModalOptions, TransitionDurations } from './modal.options';
import { msConfig } from './modalService.config';


@Injectable()
export class MDBModalService {
  // constructor props
  public config: ModalOptions = modalConfigDefaults;

  public onShow: EventEmitter<any> = new EventEmitter();
  public onShown: EventEmitter<any> = new EventEmitter();
  public onHide: EventEmitter<any> = new EventEmitter();
  public onHidden: EventEmitter<any> = new EventEmitter();

  protected isBodyOverflowing = false;
  protected originalBodyPadding = 0;

  protected scrollbarWidth = 0;

  // protected backdropRef: ComponentRef<ModalBackdropComponent>;
  protected backdropRef: ComponentRef<ModalBackdropComponent> | any;
  private _backdropLoader: ComponentLoader<ModalBackdropComponent>;
  private modalsCount = 0;
  // private lastDismissReason = '';
  private lastDismissReason: any = '';

  private loaders: ComponentLoader<ModalContainerComponent>[] = [];
  // public constructor(private clf: ComponentLoaderFactory) {
    public constructor(private clf: ComponentLoaderFactory, private el: ElementRef, private v: ViewContainerRef, private r: Renderer2) {
  //   this._backdropLoader = this.clf.createLoader<ModalBackdropComponent>(null, null, null);
    this._backdropLoader = this.clf.createLoader<ModalBackdropComponent>(this.el, this.v, this.r);
    msConfig.serviceInstance = this;
  }

  /** Shows a modal */
  show(content: string | TemplateRef<any> | any, config?: any): MDBModalRef {
    this.modalsCount++;
    this._createLoaders();
    this.config = Object.assign({}, modalConfigDefaults, config);
    this._showBackdrop();
    this.lastDismissReason = null;
    return this._showModal(content);
  }

  hide(level: number) {
    if (this.modalsCount === 1) {
      this._hideBackdrop();
      this.resetScrollbar();
    }
    this.modalsCount = this.modalsCount >= 1 ? this.modalsCount - 1 : 0;
    setTimeout(() => {
      this._hideModal(level);
      this.removeLoaders(level);
    }, this.config.animated ? TransitionDurations.BACKDROP : 0);
  }

  _showBackdrop(): void {
    const isBackdropEnabled = this.config.backdrop || this.config.backdrop === 'static';
    const isBackdropInDOM = !this.backdropRef || !this.backdropRef.instance.isShown;

    if (this.modalsCount === 1) {
      this.removeBackdrop();

      if (isBackdropEnabled && isBackdropInDOM) {
        this._backdropLoader
        .attach(ModalBackdropComponent)
        .to('body')
        .show({isAnimated: this.config.animated});
        this.backdropRef = this._backdropLoader._componentRef;
      }
    }
  }

  _hideBackdrop(): void {
    if (!this.backdropRef) {
      return;
    }
    this.backdropRef.instance.isShown = false;
    const duration = this.config.animated ? TransitionDurations.BACKDROP : 0;
    setTimeout(() => this.removeBackdrop(), duration);
  }

  _showModal(content: any): MDBModalRef {
    const modalLoader = this.loaders[this.loaders.length - 1];
    const mdbModalRef = new MDBModalRef();
    const modalContainerRef = modalLoader
    .provide({provide: ModalOptions, useValue: this.config})
    .provide({provide: MDBModalRef, useValue: mdbModalRef})
    .attach(ModalContainerComponent)
    .to('body')
    .show({content, isAnimated: this.config.animated});
    modalContainerRef.instance.level = this.getModalsCount();
    mdbModalRef.hide = () => {
      modalContainerRef.instance.hide();
    };
    mdbModalRef.content = modalLoader.getInnerComponent() || null;
    return mdbModalRef;
  }

  _hideModal(level: number): void {
    const modalLoader = this.loaders[level - 1];
    if (modalLoader) {
      modalLoader.hide();
    }
  }

  getModalsCount(): number {
    return this.modalsCount;
  }

  setDismissReason(reason: string) {
    this.lastDismissReason = reason;
  }

  protected removeBackdrop(): void {
    this._backdropLoader.hide();
    this.backdropRef = null;
  }

  /** AFTER PR MERGE MODAL.COMPONENT WILL BE USING THIS CODE*/
  /** Scroll bar tricks */
  /** @internal */
  public checkScrollbar(): void {
    this.isBodyOverflowing = document.body.clientWidth < window.innerWidth;
    this.scrollbarWidth = this.getScrollbarWidth();
  }

  public setScrollbar(): void {
    if (!document) {
      return;
    }

    this.originalBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right') || '0', 10);

    if (this.isBodyOverflowing) {
      document.body.style.paddingRight = `${this.originalBodyPadding + this.scrollbarWidth}px`;
    }
  }

  private resetScrollbar(): void {
    document.body.style.paddingRight = this.originalBodyPadding + 'px';
  }

  // thx d.walsh
  private getScrollbarWidth(): number {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;

  }

  private _createLoaders(): void {
    // const loader = this.clf.createLoader<ModalContainerComponent>(null, null, null);
    const loader = this.clf.createLoader<ModalContainerComponent>(this.el, this.v, this.r);
    this.copyEvent(loader.onBeforeShow, this.onShow);
    this.copyEvent(loader.onShown, this.onShown);
    this.copyEvent(loader.onBeforeHide, this.onHide);
    this.copyEvent(loader.onHidden, this.onHidden);
    this.loaders.push(loader);
  }

  private removeLoaders(level: number): void {
    this.loaders.splice(level - 1, 1);
    this.loaders.forEach((loader: ComponentLoader<ModalContainerComponent>, i: number) => {
      loader.instance.level = i + 1;
    });
  }

  private copyEvent(from: EventEmitter<any>, to: EventEmitter<any>) {
    from.subscribe(() => {
      to.emit(this.lastDismissReason);
    });
  }
}
