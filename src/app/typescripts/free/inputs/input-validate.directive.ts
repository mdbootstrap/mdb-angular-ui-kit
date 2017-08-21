import { Directive, Input, ElementRef, Renderer, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[mdbInputValidate]',
})

export class InputValidateDirective implements OnInit {

  @Input() public value = '';
  public wrongTextContainer: any;
  public rightTextContainer: any;


  constructor( private _elRef: ElementRef, private _renderer: Renderer ) { }

  ngOnInit() {

    // Inititalise a new <span> wrong/right elements and render it below the host component.
    this.wrongTextContainer = this._renderer.createElement(this._elRef.nativeElement.parentElement, 'span');
    this._renderer.setElementClass(this.wrongTextContainer, 'inputVal', true);
    this._renderer.setElementClass(this.wrongTextContainer, 'text-danger', true);
    this.wrongTextContainer.innerHTML = 'wrong';
    this._renderer.setElementStyle(this.wrongTextContainer, 'visibility', 'hidden');

    this.rightTextContainer = this._renderer.createElement(this._elRef.nativeElement.parentElement, 'span');
    this._renderer.setElementClass(this.rightTextContainer, 'inputVal', true);
    this._renderer.setElementClass(this.rightTextContainer, 'text-success', true);
    this.rightTextContainer.innerHTML = 'right';
    this._renderer.setElementStyle(this.rightTextContainer, 'visibility', 'hidden');

  }


  @HostListener('keyup', ['$event']) onKeyUp() {


    const inputType = event.srcElement.attributes['type'].nodeValue;


    if ( inputType === 'email' ) {

      if ( this._elRef.nativeElement.value.length === 0 ) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
      } else if ( this._elRef.nativeElement.value.match( /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/g ) ) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', true);
      } else if (! this._elRef.nativeElement.value.match( /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/g ) ) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-danger', true);
      }

    } else if ( inputType === 'password' ) {

      if ( this._elRef.nativeElement.value.match( /^[a-zA-Z0-9]+$/g ) ) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', true);
      } else if ( this._elRef.nativeElement.value.length === 0 ) {
        this._renderer.setElementClass(this._elRef.nativeElement, 'counter-success', false);
      }

    }



  }



}

