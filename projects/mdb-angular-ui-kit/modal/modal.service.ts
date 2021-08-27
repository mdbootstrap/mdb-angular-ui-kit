import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
  StaticProvider,
  TemplateRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MdbModalConfig } from './modal-config';
import { MdbModalContainerComponent } from './modal-container.component';
import { MdbModalRef } from './modal-ref';

@Injectable()
export class MdbModalService {
  constructor(
    @Inject(DOCUMENT) private _document,
    private _overlay: Overlay,
    private _injector: Injector,
    private _cfr: ComponentFactoryResolver
  ) {}

  open<T, D = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MdbModalConfig<D>
  ): MdbModalRef<T> {
    const defaultConfig = new MdbModalConfig();
    config = config ? Object.assign(defaultConfig, config) : defaultConfig;

    const overlayRef = this._createOverlay(config);
    const container = this._createContainer(overlayRef, config);
    const modalRef = this._createContent(componentOrTemplateRef, container, overlayRef, config);

    this._registerListeners<T>(modalRef, config, container);

    return modalRef;
  }

  private _createOverlay(config: MdbModalConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  private _getOverlayConfig(modalConfig: MdbModalConfig): OverlayConfig {
    const config = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      hasBackdrop: modalConfig.backdrop,
      backdropClass: 'mdb-backdrop',
    });

    return config;
  }

  private _createContainer(
    overlayRef: OverlayRef,
    config: MdbModalConfig
  ): MdbModalContainerComponent {
    const portal = new ComponentPortal(MdbModalContainerComponent, null, this._injector, this._cfr);
    const containerRef = overlayRef.attach(portal);
    containerRef.instance._config = config;
    return containerRef.instance;
  }

  private _createContent<T>(
    componentOrTemplate: ComponentType<T> | TemplateRef<T>,
    container: MdbModalContainerComponent,
    overlayRef: OverlayRef,
    config: MdbModalConfig
  ): MdbModalRef<T> {
    const modalRef = new MdbModalRef(overlayRef, container);

    if (componentOrTemplate instanceof TemplateRef) {
      container.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplate, null, {
          $implicit: config.data,
          modalRef,
        } as any)
      );
    } else {
      const injector = this._createInjector<T>(config, modalRef, container);
      const contentRef = container.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplate, config.viewContainerRef, injector)
      );

      if (config.data) {
        Object.assign(contentRef.instance, { ...config.data });
      }
    }

    return modalRef;
  }

  private _createInjector<T>(
    config: MdbModalConfig,
    modalRef: MdbModalRef<T>,
    container: MdbModalContainerComponent
  ): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    // The dialog container should be provided as the dialog container and the dialog's
    // content are created out of the same `ViewContainerRef` and as such, are siblings
    // for injector purposes. To allow the hierarchy that is expected, the dialog
    // container is explicitly provided in the injector.
    const providers: StaticProvider[] = [
      { provide: MdbModalContainerComponent, useValue: container },
      { provide: MdbModalRef, useValue: modalRef },
    ];

    return Injector.create({ parent: userInjector || this._injector, providers });
  }

  private _registerListeners<T>(
    modalRef: MdbModalRef<T>,
    config: MdbModalConfig,
    container: MdbModalContainerComponent
  ): void {
    container.backdropClick$.pipe(take(1)).subscribe(() => {
      modalRef.close();
    });

    if (config.keyboard) {
      fromEvent(container._elementRef.nativeElement, 'keydown')
        .pipe(
          filter((event: KeyboardEvent) => {
            return event.key === 'Escape';
          }),
          take(1)
        )
        .subscribe(() => {
          modalRef.close();
        });
    }
  }
}
