import {
  ApplicationRef, ComponentFactoryResolver, ElementRef, Injectable, Injector,
  NgZone, Renderer2, ViewContainerRef
} from '@angular/core';
import { ComponentLoader } from './component-loader.class';
import { PositioningService } from './../positioning/positioning.service';

@Injectable()
export class ComponentLoaderFactory {
  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              private _ngZone: NgZone,
              private _injector: Injector,
              private _posService: PositioningService,
              private _applicationRef: ApplicationRef) {}

  createLoader<T>(_elementRef: ElementRef,
                  _viewContainerRef: ViewContainerRef,
                  _renderer: Renderer2): ComponentLoader<T> {
    return new ComponentLoader<T>(
      _viewContainerRef,
      _renderer,
      _elementRef,
      this._injector,
      this._componentFactoryResolver,
      this._ngZone,
      this._applicationRef,
      this._posService
    );
  }
}
