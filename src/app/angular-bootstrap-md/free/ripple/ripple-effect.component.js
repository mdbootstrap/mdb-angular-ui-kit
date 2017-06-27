import { Directive, ElementRef } from '@angular/core';
var RippleDirective = (function () {
    function RippleDirective(el) {
        this.el = el;
    }
    RippleDirective.prototype.click = function (event) {
        if (!this.el.nativeElement.classList.contains('disabled')) {
            var button = this.el.nativeElement;
            if (!button.classList.contains('waves-effect')) {
                button.className += ' waves-effect';
            }
            if (button.classList.toString().indexOf("outline") == -1
                && button.classList.toString().indexOf("btn-flat") == -1
                && button.classList.toString().indexOf("page-link") == -1) {
                button.classList.add("waves-light");
            }
            var xPos = event.clientX - button.getBoundingClientRect().left;
            var yPos = event.clientY - button.getBoundingClientRect().top;
            var tmp = document.createElement('div');
            tmp.className += 'waves-ripple waves-rippling';
            var ripple = button.appendChild(tmp);
            var top_1 = yPos + "px";
            var left = xPos + "px";
            tmp.style.top = top_1;
            tmp.style.left = left;
            var scale = 'scale(' + ((button.clientWidth / 100) * 3) + ') translate(0,0)';
            tmp.style.webkitTransform = scale;
            tmp.style.transform = scale;
            tmp.style.opacity = '1';
            var duration = 750;
            tmp.style.webkitTransitionDuration = duration + "ms";
            tmp.style.transitionDuration = duration + "ms";
            this.removeRipple(button, ripple);
        }
    };
    RippleDirective.prototype.removeRipple = function (button, ripple) {
        ripple.classList.remove('waves-rippling');
        setTimeout(function () {
            ripple.style.opacity = '0';
            setTimeout(function () {
                button.removeChild(ripple);
            }, 750);
        }, 200);
    };
    return RippleDirective;
}());
export { RippleDirective };
RippleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ripple-radius]',
                host: {
                    '(click)': 'click($event)'
                }
            },] },
];
/** @nocollapse */
RippleDirective.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
//# sourceMappingURL=ripple-effect.component.js.map