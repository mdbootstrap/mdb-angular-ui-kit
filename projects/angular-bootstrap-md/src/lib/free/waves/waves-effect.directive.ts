import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[mdbWavesEffect]',
})
export class WavesDirective {
  el: ElementRef;

  constructor(el: ElementRef) {
    this.el = el;
  }

  @HostListener('click', ['$event'])
  public click(event: any) {
    // event.stopPropagation();

    if (!this.el.nativeElement.classList.contains('disabled')) {
      const button = this.el.nativeElement;
      if (!button.classList.contains('waves-effect')) {
        button.className += ' waves-effect';
      }

      const xPos = event.clientX - button.getBoundingClientRect().left;
      const yPos = event.clientY - button.getBoundingClientRect().top;

      const tmp = document.createElement('div');
      tmp.className += 'waves-ripple waves-rippling';
      const ripple = button.appendChild(tmp);

      const top = yPos + 'px';
      const left = xPos + 'px';

      tmp.style.top = top;
      tmp.style.left = left;

      const scale = 'scale(' + (button.clientWidth / 100) * 3 + ') translate(0,0)';

      // tslint:disable-next-line: deprecation
      tmp.style.webkitTransform = scale;
      tmp.style.transform = scale;
      tmp.style.opacity = '1';

      const duration = 750;

      // tslint:disable-next-line: deprecation
      tmp.style.webkitTransitionDuration = duration + 'ms';
      tmp.style.transitionDuration = duration + 'ms';

      this.removeRipple(button, ripple);
    }
  }

  removeRipple(button: any, ripple: any) {
    ripple.classList.remove('waves-rippling');

    setTimeout(() => {
      ripple.style.opacity = '0';

      setTimeout(() => {
        button.removeChild(ripple);
      }, 750);
    }, 200);
  }
}
