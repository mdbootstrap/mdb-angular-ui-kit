import { Directive, ElementRef, Output, HostListener, Renderer } from '@angular/core';

@Directive({
	selector: 'input[type="text"][mdbActive],input[type="email"][mdbActive],input[type="password"][mdbActive],textarea[mdbActive]'
}) 

export class ActiveDirective {

	public el: ElementRef = null;
	public elLabel: ElementRef = null;
	public elIcon: Element = null;

	constructor(el : ElementRef,public renderer: Renderer) {
		this.el = el;
    }

	@HostListener('focus', ['$event']) onClick() {
		// this.el.nativeElement = event.target;
		
		let inputId;
		let inputP;

		try {
			inputId = this.el.nativeElement.id;
		} catch(err) {}

		try {
			inputP = this.el.nativeElement.parentNode;
		} catch(err) {}
		
		
		this.elLabel = inputP.querySelector('label[for="'+ inputId +'"]') || inputP.querySelector('label');

		if(this.elLabel != null)
			this.renderer.setElementClass(this.elLabel, 'active', true);

		this.elIcon = inputP.querySelector('i') || false;

		if(this.elIcon) {
			this.renderer.setElementClass(this.elIcon, 'active', true);
		}
	}

	@HostListener('blur', ['$event']) onBlur() {
		let value = '';
		if(this.elLabel != null) {
			value = this.el.nativeElement.value || '';
			if(value == '') {
				this.renderer.setElementClass(this.elLabel, 'active', false);
				if(this.elIcon) {
					this.renderer.setElementClass(this.elIcon, 'active', false);
				}
			} 

			
		
		}
	}

}