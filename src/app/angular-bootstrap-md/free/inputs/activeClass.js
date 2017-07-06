import { Directive, ElementRef, HostListener, Renderer } from '@angular/core';
var ActiveDirective = (function () {
    function ActiveDirective(el, renderer) {
        this.renderer = renderer;
        this.el = null;
        this.elLabel = null;
        this.elIcon = null;
        this.el = el;
    }
    ActiveDirective.prototype.onClick = function () {
        this.initComponent();
    };
    ActiveDirective.prototype.onBlur = function () {
        this.checkValue();
    };
    ActiveDirective.prototype.ngAfterViewInit = function () {
        this.initComponent();
        this.checkValue();
    };
    ActiveDirective.prototype.initComponent = function () {
        // this.el.nativeElement = event.target;
        var inputId;
        var inputP;
        try {
            inputId = this.el.nativeElement.id;
        }
        catch (err) { }
        try {
            inputP = this.el.nativeElement.parentNode;
        }
        catch (err) { }
        this.elLabel = inputP.querySelector('label[for="' + inputId + '"]') || inputP.querySelector('label');
        if (this.elLabel != null)
            this.renderer.setElementClass(this.elLabel, 'active', true);
        this.elIcon = inputP.querySelector('i') || false;
        if (this.elIcon) {
            this.renderer.setElementClass(this.elIcon, 'active', true);
        }
    };
    ActiveDirective.prototype.checkValue = function () {
        var value = '';
        if (this.elLabel != null) {
            value = this.el.nativeElement.value || '';
            if (value === '') {
                this.renderer.setElementClass(this.elLabel, 'active', false);
                if (this.elIcon) {
                    this.renderer.setElementClass(this.elIcon, 'active', false);
                }
            }
        }
    };
    return ActiveDirective;
}());
export { ActiveDirective };
ActiveDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mdbActive]'
            },] },
];
/** @nocollapse */
ActiveDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
]; };
ActiveDirective.propDecorators = {
    'onClick': [{ type: HostListener, args: ['focus', ['$event'],] },],
    'onBlur': [{ type: HostListener, args: ['blur', ['$event'],] },],
};
//# sourceMappingURL=activeClass.js.map