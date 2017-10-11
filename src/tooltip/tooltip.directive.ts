import {
  Directive, Input, TemplateRef, ViewContainerRef, Output, EventEmitter,
  Renderer, ElementRef, OnInit, OnDestroy
} from '@angular/core';
import { TooltipContainerComponent } from './tooltip.component';
import { TooltipConfig } from './tooltip.service';
import { ComponentLoaderFactory, ComponentLoader } from '../utils/component-loader';
import { OnChange } from '../utils/decorators';

@Directive({
  selector: '[mdbTooltip]',
  exportAs: 'mdb-tooltip'
})
export class TooltipDirective implements OnInit, OnDestroy {
  /**
   * Content to be displayed as tooltip.
   */
   @OnChange()
   @Input() public mdbTooltip: string | TemplateRef<any>;
   /** Fired when tooltip content changes */
   @Output() public tooltipChange: EventEmitter<string | TemplateRef<any>> = new EventEmitter();

  /**
   * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
   */
   @Input() public placement: string;
  /**
   * Specifies events that should trigger. Supports a space separated list of
   * event names.
   */
   @Input() public triggers: string;
  /**
   * A selector specifying the element the tooltip should be appended to.
   * Currently only supports "body".
   */
   @Input() public container: string;

  /**
   * Returns whether or not the tooltip is currently being shown
   */
   @Input()
   public get isOpen(): boolean { return this._tooltip.isShown; }

   public set isOpen(value: boolean) {
     if (value) {this.show(); } else {this.hide(); }
   }

  /**
   * Allows to disable tooltip
   */
   @Input() public isDisabled: boolean;

  /**
   * Emits an event when the tooltip is shown
   */
   @Output() public onShown: EventEmitter<any>;
  /**
   * Emits an event when the tooltip is hidden
   */
   @Output() public onHidden: EventEmitter<any>;

   @Input() public delay = 0;

   @Input() public fadeDuration = 150;

   protected _delayTimeoutId: any;

   private _tooltip: ComponentLoader<TooltipContainerComponent>;

   public constructor(_viewContainerRef: ViewContainerRef,
     _renderer: Renderer,
     _elementRef: ElementRef,
     cis: ComponentLoaderFactory,
     config: TooltipConfig) {
     this._tooltip = cis
     .createLoader<TooltipContainerComponent>(_elementRef, _viewContainerRef, _renderer)
     .provide({provide: TooltipConfig, useValue: config});

     Object.assign(this, config);
     this.onShown = this._tooltip.onShown;
     this.onHidden = this._tooltip.onHidden;
   }

   public ngOnInit(): void {
     this._tooltip.listen({
       triggers: this.triggers,
       show: () => this.show()
     });
     this.tooltipChange.subscribe((value: any) => {
       if (!value) {
         this._tooltip.hide();
       }
     });
   }

  /**
   * Toggles an element’s tooltip. This is considered a “manual” triggering of
   * the tooltip.
   */
   public toggle(): void {
     if (this.isOpen) {
       return this.hide();
     }

     this.show();
   }

  /**
   * Opens an element’s tooltip. This is considered a “manual” triggering of
   * the tooltip.
   */
   public show(): void {
     if (this.isOpen || this.isDisabled || this._delayTimeoutId || !this.mdbTooltip) {
       return;
     }

     const showTooltip = () => this._tooltip
     .attach(TooltipContainerComponent)
     .to(this.container)
     .position({attachment: this.placement})
     .show({
       content: this.mdbTooltip,
       placement: this.placement
     });

     if (this.delay) {
       this._delayTimeoutId = setTimeout(() => { showTooltip(); }, this.delay);
     } else {
       showTooltip();
     }
   }

  /**
   * Closes an element’s tooltip. This is considered a “manual” triggering of
   * the tooltip.
   */
   public hide(): void {
     if (this._delayTimeoutId) {
       clearTimeout(this._delayTimeoutId);
       this._delayTimeoutId = undefined;
     }

     if (!this._tooltip.isShown) {
       return;
     }

     this._tooltip.instance.classMap.in = false;
     setTimeout(() => {
       this._tooltip.hide();
     }, this.fadeDuration);
   }

   public dispose() {
     this._tooltip.dispose();
   }

   public ngOnDestroy(): void {
     this._tooltip.dispose();
   }
 }
