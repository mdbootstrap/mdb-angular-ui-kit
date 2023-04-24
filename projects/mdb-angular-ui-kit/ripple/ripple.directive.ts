import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';
import { colorToRGB, durationToMsNumber, getDiameter } from './ripple-utils';

const TRANSITION_BREAK_OPACITY = 0.5;

const GRADIENT =
  'rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%';
const BOOTSTRAP_COLORS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
];

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbRipple]',
  exportAs: 'mdbRipple',
})
export class MdbRippleDirective {
  @Input()
  get rippleCentered(): boolean {
    return this._rippleCentered;
  }
  set rippleCentered(value: boolean) {
    this._rippleCentered = coerceBooleanProperty(value);
  }
  private _rippleCentered = false;

  @Input() rippleColor = '';
  @Input() rippleDuration = '500ms';
  @Input() rippleRadius = 0;

  @Input()
  get rippleUnbound(): boolean {
    return this._rippleUnbound;
  }
  set rippleUnbound(value: boolean) {
    this._rippleUnbound = coerceBooleanProperty(value);
  }
  private _rippleUnbound = false;

  private _rippleInSpan = false;

  private _rippleTimer = null;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {}

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  @HostBinding('class.ripple-surface') ripple = true;

  @HostListener('click', ['$event'])
  _createRipple(event: any): void {
    const { layerX, layerY } = event;
    const offsetX = layerX;
    const offsetY = layerY;
    const height = this.host.offsetHeight;
    const width = this.host.offsetWidth;
    const duration = durationToMsNumber(this.rippleDuration);
    const diameterOptions = {
      offsetX: this.rippleCentered ? height / 2 : offsetX,
      offsetY: this.rippleCentered ? width / 2 : offsetY,
      height,
      width,
    };
    const diameter = getDiameter(diameterOptions);
    const radiusValue = this.rippleRadius || diameter / 2;

    const opacity = {
      delay: duration * TRANSITION_BREAK_OPACITY,
      duration: duration - duration * TRANSITION_BREAK_OPACITY,
    };

    const styles = {
      left: this.rippleCentered ? `${width / 2 - radiusValue}px` : `${offsetX - radiusValue}px`,
      top: this.rippleCentered ? `${height / 2 - radiusValue}px` : `${offsetY - radiusValue}px`,
      height: `${this.rippleRadius * 2 || diameter}px`,
      width: `${this.rippleRadius * 2 || diameter}px`,
      transitionDelay: `0s, ${opacity.delay}ms`,
      transitionDuration: `${duration}ms, ${opacity.duration}ms`,
    };

    const rippleHTML = this._renderer.createElement('div');

    if (this.host.tagName.toLowerCase() === 'input') {
      this._createWrapperSpan();
    }

    this._createHTMLRipple(this.host, rippleHTML, styles);
    this._removeHTMLRipple(rippleHTML, duration);
  }

  private _createWrapperSpan(): void {
    const parent = this._renderer.parentNode(this.host);
    this._rippleInSpan = true;
    if (parent.tagName.toLowerCase() === 'span' && parent.classList.contains('ripple-surface')) {
      this._elementRef.nativeElement = parent;
    } else {
      const wrapper = this._renderer.createElement('span');

      this._renderer.addClass(wrapper, 'ripple-surface');
      this._renderer.addClass(wrapper, 'input-wrapper');

      this._renderer.setStyle(wrapper, 'border', 0);

      const shadow = getComputedStyle(this.host).boxShadow;
      this._renderer.setStyle(wrapper, 'box-shadow', shadow);

      // Put element as child
      parent.replaceChild(wrapper, this.host);
      wrapper.appendChild(this.host);
      this._elementRef.nativeElement = wrapper;
    }
    this.host.focus();
  }

  _removeWrapperSpan() {
    const child = this.host.firstChild;
    this.host.replaceWith(child);
    this._elementRef.nativeElement = child;
    this.host.focus();
    this._rippleInSpan = false;
  }

  private _createHTMLRipple(wrapper: HTMLElement, ripple: HTMLElement, styles: any): void {
    Object.keys(styles).forEach((property) => (ripple.style[property] = styles[property]));
    this._renderer.addClass(ripple, 'ripple-wave');

    if (this.rippleColor !== '') {
      this._removeOldColorClasses(wrapper);
      this._addColor(ripple, wrapper);
    }

    this._toggleUnbound(wrapper);
    this._appendRipple(ripple, wrapper);
  }

  private _removeHTMLRipple(ripple: HTMLElement, duration: number): void {
    if (this._rippleTimer) {
      clearTimeout(this._rippleTimer);
      this._rippleTimer = null;
    }
    this._rippleTimer = setTimeout(() => {
      if (ripple) {
        ripple.remove();
        this.host.querySelectorAll('.ripple-wave').forEach((rippleEl) => {
          rippleEl.remove();
        });
        if (this._rippleInSpan && this.host.classList.contains('input-wrapper')) {
          this._removeWrapperSpan();
        }
      }
    }, duration);
  }

  _appendRipple(target: HTMLElement, parent: HTMLElement): void {
    const FIX_ADD_RIPPLE_EFFECT = 50; // delay for active animations
    this._renderer.appendChild(parent, target);
    setTimeout(() => {
      this._renderer.addClass(target, 'active');
    }, FIX_ADD_RIPPLE_EFFECT);
  }

  _toggleUnbound(target: HTMLElement): void {
    if (this.rippleUnbound) {
      this._renderer.addClass(target, 'ripple-surface-unbound');
    } else {
      this._renderer.removeClass(target, 'ripple-surface-unbound');
    }
  }

  _addColor(target: HTMLElement, parent: HTMLElement): void {
    const isBootstrapColor = BOOTSTRAP_COLORS.find(
      (color) => color === this.rippleColor.toLowerCase()
    );

    if (isBootstrapColor) {
      this._renderer.addClass(parent, `${'ripple-surface'}-${this.rippleColor.toLowerCase()}`);
    } else {
      const rgbValue = colorToRGB(this.rippleColor).join(',');
      const gradientImage = GRADIENT.split('{{color}}').join(`${rgbValue}`);
      target.style.backgroundImage = `radial-gradient(circle, ${gradientImage})`;
    }
  }

  _removeOldColorClasses(target: HTMLElement): void {
    const REGEXP_CLASS_COLOR = new RegExp(`${'ripple-surface'}-[a-z]+`, 'gi');
    const PARENT_CLASSS_COLOR = target.classList.value.match(REGEXP_CLASS_COLOR) || [];
    PARENT_CLASSS_COLOR.forEach((className) => {
      this._renderer.removeClass(target, className);
    });
  }

  static ngAcceptInputType_rippleCentered: BooleanInput;
  static ngAcceptInputType_rippleUnbound: BooleanInput;
}
