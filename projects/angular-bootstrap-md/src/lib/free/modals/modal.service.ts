import {
  ComponentRef,
  Injectable,
  TemplateRef,
  EventEmitter,
  Renderer2,
  RendererFactory2,
  ViewContainerRef,
  ElementRef,
} from '@angular/core';

import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ModalBackdropComponent } from './modalBackdrop.component';
import { ModalContainerComponent } from './modalContainer.component';
import {
  MDBModalRef,
  ClassName,
  modalConfigDefaults,
  ModalOptions,
  TransitionDurations,
} from './modal.options';

@Injectable()
export class MDBModalService {
  // constructor props
  public config: ModalOptions = modalConfigDefaults;
  private renderer: Renderer2;
  private vcr: ViewContainerRef;
  private el: ElementRef;

  public open: EventEmitter<any> = new EventEmitter();
  public opened: EventEmitter<any> = new EventEmitter();
  public close: EventEmitter<any> = new EventEmitter();
  public closed: EventEmitter<any> = new EventEmitter();

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
  public constructor(rendererFactory: RendererFactory2, private clf: ComponentLoaderFactory) {
    //   this._backdropLoader = this.clf.createLoader<ModalBackdropComponent>(null, null, null);
    this._backdropLoader = this.clf.createLoader<ModalBackdropComponent>(
      this.el,
      this.vcr,
      this.renderer
    );
    this.renderer = rendererFactory.createRenderer(null, null);
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
    setTimeout(
      () => {
        this._hideModal(level);
        this.removeLoaders(level);
      },
      this.config.animated ? TransitionDurations.BACKDROP : 0
    );
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
          .show({ isAnimated: this.config.animated });
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
      .provide({ provide: ModalOptions, useValue: this.config })
      .provide({ provide: MDBModalRef, useValue: mdbModalRef })
      .attach(ModalContainerComponent)
      .to('body')
      .show({
        content,
        isAnimated: this.config.animated,
        data: this.config.data,
        mdbModalService: this,
      });
    modalContainerRef.instance.focusModalElement();
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

    this.originalBodyPadding = parseInt(
      window.getComputedStyle(document.body).getPropertyValue('padding-right') || '0',
      10
    );
  }

  private resetScrollbar(): void {
    document.body.style.paddingRight = this.originalBodyPadding + 'px';
  }

  // thx d.walsh
  private getScrollbarWidth(): number {
    const scrollDiv = this.renderer.createElement('div');
    this.renderer.addClass(scrollDiv, ClassName.SCROLLBAR_MEASURER);
    this.renderer.appendChild(document.body, scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.renderer.removeChild(document.body, scrollDiv);

    return scrollbarWidth;
  }

  private _createLoaders(): void {
    // const loader = this.clf.createLoader<ModalContainerComponent>(null, null, null);
    const loader = this.clf.createLoader<ModalContainerComponent>(this.el, this.vcr, this.renderer);
    this.copyEvent(loader.onBeforeShow, this.open);
    this.copyEvent(loader.onShown, this.opened);
    this.copyEvent(loader.onBeforeHide, this.close);
    this.copyEvent(loader.onHidden, this.closed);
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
