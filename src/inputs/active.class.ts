import {Directive, ElementRef, Output, Input, HostListener, Renderer, AfterViewInit} from '@angular/core';

@Directive({
  selector: '[mdbActive]'
})

export class ActiveDirective implements AfterViewInit {

  @Input() public mdbActive: ActiveDirective;
  public el: ElementRef = null;
  public elLabel: ElementRef = null;
  public elIcon: Element = null;

  constructor(el: ElementRef, public renderer: Renderer) {
    this.el = el;
  }

  @HostListener('focus', ['$event']) onClick() {
    this.initComponent();
  }

  @HostListener('blur', ['$event']) onBlur() {
    this.checkValue();
  }

  ngAfterViewInit() {
    this.initComponent();
    this.checkValue();
    setTimeout(() => {
      this.checkValue();
    }, 0);
  }

  private initComponent(): void {
    let inputId;
    let inputP;

    try {
      inputId = this.el.nativeElement.id;
    } catch (err) {}

    try {
      inputP = this.el.nativeElement.parentNode;
    } catch (err) {}


    this.elLabel = inputP.querySelector('label[for="' + inputId + '"]') || inputP.querySelector('label');
    if (this.elLabel != null) {
      this.renderer.setElementClass(this.elLabel, 'active', true);
    }

    this.elIcon = inputP.querySelector('i') || false;

    if (this.elIcon) {
      this.renderer.setElementClass(this.elIcon, 'active', true);
    }
  }

  private checkValue(): void {
    let value = '';
    if (this.elLabel != null) {
      value = this.el.nativeElement.value || '';
      if (value === '') {
        this.renderer.setElementClass(this.elLabel, 'active', false);
        if (this.elIcon) {
          this.renderer.setElementClass(this.elIcon, 'active', false);
        }
      } else {
        this.renderer.setElementClass(this.elLabel, 'active', true);
      }
    }
  }
}
