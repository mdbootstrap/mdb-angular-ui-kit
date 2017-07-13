import { Directive, ElementRef, Input, HostListener } from '@angular/core';
@Directive({ 
	selector: '[ripple-radius]',
	host: {
		'(click)': 'click($event)'
	}
})
export class RippleDirective {
	el: ElementRef;
	

    constructor(el: ElementRef) {
    	this.el = el;
    }


	public click(event: any) {
		
		if(!this.el.nativeElement.classList.contains('disabled')) {
		
			let button = this.el.nativeElement;
			if(!button.classList.contains('waves-effect')){
				button.className += ' waves-effect';
			}

			let xPos = event.clientX - button.getBoundingClientRect().left;
			let yPos = event.clientY - button.getBoundingClientRect().top;
			

			let tmp = document.createElement('div');
			tmp.className += 'waves-ripple waves-rippling';
			var ripple = button.appendChild(tmp);

			let top = yPos + "px";
			let left = xPos + "px";
		
			tmp.style.top = top;
			tmp.style.left = left;

			let scale = 'scale(' + ((button.clientWidth / 100) * 3) + ') translate(0,0)';

			tmp.style.webkitTransform = scale;
			tmp.style.transform = scale;
			tmp.style.opacity = '1';

			let duration = 750;

			tmp.style.webkitTransitionDuration = duration + "ms";
			tmp.style.transitionDuration = duration + "ms";
			

			this.removeRipple(button, ripple);
		}
	}

	removeRipple(button:any, ripple:any) {
		ripple.classList.remove('waves-rippling');

		setTimeout(() => {
			ripple.style.opacity = '0';

			setTimeout(() => {
				button.removeChild(ripple);
			}, 750);
		}, 200);


		
	}
}