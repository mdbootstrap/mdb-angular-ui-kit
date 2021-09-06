import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';

const TRANSITION_BREAK_OPACITY = 0.5;

const GRADIENT =
  'rgba({{color}}, 0.2) 0, rgba({{color}}, 0.3) 40%, rgba({{color}}, 0.4) 50%, rgba({{color}}, 0.5) 60%, rgba({{color}}, 0) 70%';
const DEFAULT_RIPPLE_COLOR = [0, 0, 0];
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
    const duration = this._durationToMsNumber(this.rippleDuration);
    const diameterOptions = {
      offsetX: this.rippleCentered ? height / 2 : offsetX,
      offsetY: this.rippleCentered ? width / 2 : offsetY,
      height,
      width,
    };
    const diameter = this._getDiameter(diameterOptions);
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

    this._createHTMLRipple(this.host, rippleHTML, styles);
    this._removeHTMLRipple(rippleHTML, duration);
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
    setTimeout(() => {
      if (ripple) {
        ripple.remove();
      }
    }, duration);
  }

  private _durationToMsNumber(time: string): number {
    return Number(time.replace('ms', '').replace('s', '000'));
  }

  _getDiameter({ offsetX, offsetY, height, width }): number {
    const top = offsetY <= height / 2;
    const left = offsetX <= width / 2;
    const pythagorean = (sideA, sideB) => Math.sqrt(sideA ** 2 + sideB ** 2);

    const positionCenter = offsetY === height / 2 && offsetX === width / 2;
    // mouse position on the quadrants of the coordinate system
    const quadrant = {
      first: top === true && left === false,
      second: top === true && left === true,
      third: top === false && left === true,
      fourth: top === false && left === false,
    };

    const getCorner = {
      topLeft: pythagorean(offsetX, offsetY),
      topRight: pythagorean(width - offsetX, offsetY),
      bottomLeft: pythagorean(offsetX, height - offsetY),
      bottomRight: pythagorean(width - offsetX, height - offsetY),
    };

    let diameter = 0;

    if (positionCenter || quadrant.fourth) {
      diameter = getCorner.topLeft;
    } else if (quadrant.third) {
      diameter = getCorner.topRight;
    } else if (quadrant.second) {
      diameter = getCorner.bottomRight;
    } else if (quadrant.first) {
      diameter = getCorner.bottomLeft;
    }
    return diameter * 2;
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
      const rgbValue = this._colorToRGB(this.rippleColor).join(',');
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

  _colorToRGB(color: any): number[] {
    // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
    function hexToRgb(color: any): any {
      const HEX_COLOR_LENGTH = 7;
      const IS_SHORT_HEX = color.length < HEX_COLOR_LENGTH;
      if (IS_SHORT_HEX) {
        color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
      }
      return [
        parseInt(color.substr(1, 2), 16),
        parseInt(color.substr(3, 2), 16),
        parseInt(color.substr(5, 2), 16),
      ];
    }

    // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
    function namedColorsToRgba(color: any): any {
      const tempElem = document.body.appendChild(document.createElement('fictum'));
      const flag = 'rgb(1, 2, 3)';
      tempElem.style.color = flag;
      if (tempElem.style.color !== flag) {
        return DEFAULT_RIPPLE_COLOR;
      }
      tempElem.style.color = color;
      if (tempElem.style.color === flag || tempElem.style.color === '') {
        return DEFAULT_RIPPLE_COLOR;
      } // color parse failed
      color = getComputedStyle(tempElem).color;
      document.body.removeChild(tempElem);
      return color;
    }

    // eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
    function rgbaToRgb(color: any): any {
      color = color.match(/[.\d]+/g).map((a) => +Number(a));
      color.length = 3;
      return color;
    }

    if (color.toLowerCase() === 'transparent') {
      return DEFAULT_RIPPLE_COLOR;
    }
    if (color[0] === '#') {
      return hexToRgb(color);
    }
    if (color.indexOf('rgb') === -1) {
      color = namedColorsToRgba(color);
    }
    if (color.indexOf('rgb') === 0) {
      return rgbaToRgb(color);
    }

    return DEFAULT_RIPPLE_COLOR;
  }

  static ngAcceptInputType_rippleCentered: BooleanInput;
  static ngAcceptInputType_rippleUnbound: BooleanInput;
}
