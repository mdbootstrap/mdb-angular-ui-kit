import { Directive, Input, ElementRef, Renderer, HostListener, OnInit } from '@angular/core';



@Directive({
  selector: '[mdbInputValidate]',
})

export class InputValidateDirective implements OnInit {

  @Input() public value = '';
  @Input('minLength') public minLength: string = '0';
  @Input('maxLength') public maxLength: string = '524288';
  public wrongTextContainer: any;
  public rightTextContainer: any;


  constructor(private _elRef: ElementRef, private _renderer: Renderer) { }
  ngOnInit() {
    // Inititalise a new <span> wrong/right elements and render it below the host component.
    this.wrongTextContainer = this._renderer.createElement(this._elRef.nativeElement.parentElement, 'span');
    this._renderer.setElementClass(this.wrongTextContainer, 'inputVal', true);
    this._renderer.setElementClass(this.wrongTextContainer, 'text-danger', true);
    const textWrong = this._elRef.nativeElement.getAttribute('data-error');
    this.wrongTextContainer.innerHTML = (textWrong ? textWrong : 'wrong');
    this._renderer.setElementStyle(this.wrongTextContainer, 'visibility', 'hidden');

    this.rightTextContainer = this._renderer.createElement(this._elRef.nativeElement.parentElement, 'span');
    this._renderer.setElementClass(this.rightTextContainer, 'inputVal', true);
    this._renderer.setElementClass(this.rightTextContainer, 'text-success', true);
    const textSuccess = this._elRef.nativeElement.getAttribute('data-success');
    this.rightTextContainer.innerHTML = (textSuccess ? textSuccess : 'success');
    this._renderer.setElementStyle(this.rightTextContainer, 'visibility', 'hidden');

  }


  @HostListener('blur', ['$event']) onBlur() {

    const inputType = this._elRef.nativeElement.type;

    if (inputType === 'email') {

      /*tslint:disable:max-line-length*/
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this._elRef.nativeElement.value.length === 0) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
      } else if (re.test(this._elRef.nativeElement.value) && this._elRef.nativeElement.value.length >= this.minLength && this._elRef.nativeElement.value.length <= this.maxLength) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', true);
      } else if (!re.test(this._elRef.nativeElement.value) || this._elRef.nativeElement.value.length < this.minLength || this._elRef.nativeElement.value.length > this.maxLength) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', true);
      }

    } else if (inputType === 'password') {
      if (this._elRef.nativeElement.value.length === 0) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
        // tslint:disable-next-line:max-line-length
      } else if (this._elRef.nativeElement.value.match(/^[a-zA-Z0-9]+$/g) && this._elRef.nativeElement.value.length >= this.minLength && this._elRef.nativeElement.value.length <= this.maxLength) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', true);
        // tslint:disable-next-line:max-line-length
      } else if (!this._elRef.nativeElement.value.match(/^[a-zA-Z0-9]+$/g) || this._elRef.nativeElement.value.length < this.minLength || this._elRef.nativeElement.value.length > this.maxLength) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', true);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
      }

    } else if (inputType === 'text') {
      if (this._elRef.nativeElement.value.length === 0) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
        // tslint:disable-next-line:max-line-length
      } else if (this._elRef.nativeElement.value.match(/^[a-zA-Z0-9]+$/g) && this._elRef.nativeElement.value.length >= this.minLength && this._elRef.nativeElement.value.length <= this.maxLength) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', true);
        // tslint:disable-next-line:max-line-length
      } else if (!this._elRef.nativeElement.value.match(/^[a-zA-Z0-9]+$/g) || this._elRef.nativeElement.value.length < this.minLength || this._elRef.nativeElement.value.length > this.maxLength) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', true);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
      }
    }
  }
}

