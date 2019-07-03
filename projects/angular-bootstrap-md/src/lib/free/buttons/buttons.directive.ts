import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[mdbBtn]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./buttons-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MdbBtnDirective implements OnInit {
  @Input() color = '';
  @Input() rounded = false;
  @Input() gradient = '';
  @Input() outline = false;
  @Input() flat = false;
  @Input() size = '';
  @Input() block = false;
  @Input() floating = false;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const colorClass = 'btn-' + this.color;
    const gradientClass = this.gradient + '-gradient';
    const outlineClass = 'btn-outline-' + this.color;
    const flatClass = 'btn-flat';
    const roundedClass = 'btn-rounded';
    const sizeClass = 'btn-' + this.size;
    const blockClass = 'btn-block';
    const floatingClass = 'btn-floating';

    this.renderer.addClass(this.el.nativeElement, 'btn');

    if (this.color !== '') {
      this.renderer.addClass(this.el.nativeElement, colorClass);
    }

    if (this.rounded) {
      this.renderer.addClass(this.el.nativeElement, roundedClass);
    }

    if (this.gradient) {
      if (this.color !== '') {
        this.renderer.removeClass(this.el.nativeElement, colorClass);
      }
      this.renderer.addClass(this.el.nativeElement, gradientClass);
    }

    if (this.outline) {
      this.renderer.removeClass(this.el.nativeElement, colorClass);
      this.renderer.addClass(this.el.nativeElement, outlineClass);
    }

    if (this.flat) {
      if (this.color) {
        this.renderer.removeClass(this.el.nativeElement, colorClass);
      }
      if (this.gradient) {
        this.renderer.removeClass(this.el.nativeElement, gradientClass);
      }
      if (this.outline) {
        this.renderer.removeClass(this.el.nativeElement, outlineClass);
      }
      if (this.rounded) {
        this.renderer.removeClass(this.el.nativeElement, roundedClass);
      }
      this.renderer.addClass(this.el.nativeElement, flatClass);
    }

    if (this.size) {
      this.renderer.addClass(this.el.nativeElement, sizeClass);
    }

    if (this.block) {
      this.renderer.addClass(this.el.nativeElement, blockClass);
    }

    if (this.floating) {
      this.renderer.removeClass(this.el.nativeElement, 'btn');
      this.renderer.addClass(this.el.nativeElement, floatingClass);
    }
  }
}
