import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[mdbBtn]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./buttons-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MdbBtnDirective implements OnInit, OnChanges {
  @Input() color = '';
  @Input() rounded = false;
  @Input() gradient = '';
  @Input() outline = false;
  @Input() flat = false;
  @Input() size = '';
  @Input() block = false;
  @Input() floating = false;

  public simpleChange: string;
  public simpleChangeValue: string;

  private colorClass: string;
  private gradientClass: string;
  private outlineClass: string;
  private flatClass: string;
  private roundedClass: string;
  private sizeClass: string;
  private blockClass: string;
  private floatingClass: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.colorClass = 'btn-' + this.color;
    this.gradientClass = this.gradient + '-gradient';
    this.outlineClass = 'btn-outline-' + this.color;
    this.flatClass = 'btn-flat';
    this.roundedClass = 'btn-rounded';
    this.sizeClass = 'btn-' + this.size;
    this.blockClass = 'btn-block';
    this.floatingClass = 'btn-floating';
    this.renderer.addClass(this.el.nativeElement, 'btn');

    this.initClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.color) {
      this.renderer.removeClass(this.el.nativeElement, this.colorClass);
      if (this.color && this.color !== '') {
        this.colorClass = 'btn-' + this.color;
        this.renderer.addClass(this.el.nativeElement, this.colorClass);
      }

      if (this.outline) {
        const currentOutlineClass = this.outlineClass;
        this.outlineClass = 'btn-outline-' + this.color;
        this.renderer.removeClass(this.el.nativeElement, currentOutlineClass);
        this.renderer.addClass(this.el.nativeElement, this.outlineClass);
      }
    }
    if (changes.gradient) {
      this.renderer.removeClass(this.el.nativeElement, this.gradientClass);
      if (this.gradient !== '') {
        this.gradientClass = this.gradient + '-gradient';
        this.renderer.addClass(this.el.nativeElement, this.gradientClass);
      }
    }
    if (changes.outline) {
      if (!this.outline) {
        this.renderer.removeClass(this.el.nativeElement, this.outlineClass);
      }
      if (this.outline) {
        this.renderer.removeClass(this.el.nativeElement, this.colorClass);
        this.renderer.addClass(this.el.nativeElement, this.outlineClass);
      }
      this.outlineClass = 'btn-outline-' + this.color;
    }
    if (changes.flat) {
      this.renderer.removeClass(this.el.nativeElement, this.flatClass);
      if (this.flat) {
        if (this.color) {
          this.renderer.removeClass(this.el.nativeElement, this.colorClass);
        }
        if (this.gradient) {
          this.renderer.removeClass(this.el.nativeElement, this.gradientClass);
        }
        if (this.outline) {
          this.renderer.removeClass(this.el.nativeElement, this.outlineClass);
        }
        if (this.rounded) {
          this.renderer.removeClass(this.el.nativeElement, this.roundedClass);
        }
        this.renderer.addClass(this.el.nativeElement, this.flatClass);
      }
    }

    if (changes.rounded) {
      this.renderer.removeClass(this.el.nativeElement, this.roundedClass);
      if (this.rounded) {
        this.roundedClass = 'btn-rounded';
        this.renderer.addClass(this.el.nativeElement, this.roundedClass);
      }
    }
    if (changes.size) {
      this.renderer.removeClass(this.el.nativeElement, this.sizeClass);
      if (this.size !== '') {
        this.sizeClass = 'btn-' + this.size;
        this.renderer.addClass(this.el.nativeElement, this.sizeClass);
      }
    }
    if (changes.block) {
      this.renderer.removeClass(this.el.nativeElement, this.blockClass);
      if (this.block) {
        this.blockClass = 'btn-block';
        this.renderer.addClass(this.el.nativeElement, this.blockClass);
      }
    }
    if (changes.floating) {
      if (!this.floating) {
        this.renderer.removeClass(this.el.nativeElement, this.floatingClass);
        this.renderer.addClass(this.el.nativeElement, 'btn');
      }

      if (this.floating) {
        this.floatingClass = 'btn-floating';
        this.renderer.addClass(this.el.nativeElement, this.floatingClass);
        this.renderer.removeClass(this.el.nativeElement, 'btn');
      }
    }
  }

  initClasses() {
    if (this.color !== '') {
      this.renderer.addClass(this.el.nativeElement, this.colorClass);
    }

    if (this.rounded) {
      this.renderer.addClass(this.el.nativeElement, this.roundedClass);
    }

    if (this.gradient) {
      if (this.color !== '') {
        this.renderer.removeClass(this.el.nativeElement, this.colorClass);
      }
      this.renderer.addClass(this.el.nativeElement, this.gradientClass);
    }

    if (this.outline) {
      this.renderer.removeClass(this.el.nativeElement, this.colorClass);
      this.renderer.addClass(this.el.nativeElement, this.outlineClass);
    }

    if (this.flat) {
      if (this.color) {
        this.renderer.removeClass(this.el.nativeElement, this.colorClass);
      }
      if (this.gradient) {
        this.renderer.removeClass(this.el.nativeElement, this.gradientClass);
      }
      if (this.outline) {
        this.renderer.removeClass(this.el.nativeElement, this.outlineClass);
      }
      if (this.rounded) {
        this.renderer.removeClass(this.el.nativeElement, this.roundedClass);
      }
      this.renderer.addClass(this.el.nativeElement, this.flatClass);
    }

    if (this.size) {
      this.renderer.addClass(this.el.nativeElement, this.sizeClass);
    }

    if (this.block) {
      this.renderer.addClass(this.el.nativeElement, this.blockClass);
    }

    if (this.floating) {
      this.renderer.addClass(this.el.nativeElement, this.floatingClass);
      this.renderer.removeClass(this.el.nativeElement, 'btn');
    }
  }
}
