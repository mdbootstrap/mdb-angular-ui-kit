import {Directive, ElementRef,  Input, HostListener, Renderer2, AfterViewInit, AfterViewChecked} from '@angular/core';

@Directive({
  selector: '[mdbActive]'
})

export class ActiveDirective implements AfterViewInit, AfterViewChecked {

  @Input() public mdbActive: ActiveDirective;
  isClicked: boolean = false;
  // public el: ElementRef = null;
  public el: ElementRef | any = null;
  // public elLabel: ElementRef = null;
  public elLabel: ElementRef | any = null;
  // public elIcon: Element = null;
  public elIcon: Element | any = null;

  constructor(el: ElementRef, public renderer: Renderer2) {
    this.el = el; }
  @HostListener('focus', ['$event']) onClick() {
    this.initComponent();
    this.isClicked = true;
  }

  @HostListener('click', ['$event']) Click() {
    this.isClicked = true;
  }

  @HostListener('blur', ['$event']) onBlur() {
    this.checkValue();
    this.isClicked = false;
  }

  // ngAfterViewInit with checkValue after setTimeout is needed in situation when we have prefilled
  // forms, and label has to be lifted up.
ngAfterViewInit() {
    setTimeout(() => {
      this.checkValue();
    }, 0);
}
  ngAfterViewChecked() {
    this.initComponent();
    this.checkValue();
  }

  private initComponent(): void {
    let inputId;
    let inputP;
    try {
      inputId = this.el.nativeElement.id;
    } catch (err) { }

    try {
      inputP = this.el.nativeElement.parentNode;
    } catch (err) { }


    this.elLabel = inputP.querySelector('label[for="' + inputId + '"]') || inputP.querySelector('label');
    if (this.elLabel != null) {
      this.renderer.addClass(this.elLabel, 'active');
    }

    this.elIcon = inputP.querySelector('i') || false;

    if (this.elIcon) {
      this.renderer.addClass(this.elIcon, 'active');
    }
  }

  private checkValue(): void {
    let value = '';
    if (this.elLabel != null) {
      value = this.el.nativeElement.value || '';
      if (value === '') {
        this.renderer.removeClass(this.elLabel, 'active');
        if (this.elIcon) {
          this.renderer.removeClass(this.elIcon, 'active');
        }
      } if (value === '' && this.isClicked || value === '' && this.el.nativeElement.placeholder) {
        this.renderer.addClass(this.elLabel, 'active');
      }
    }
  }
}
