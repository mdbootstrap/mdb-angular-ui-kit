import { Component, ViewChild, Input, Renderer, HostListener } from '@angular/core';
var Navbars = (function () {
    function Navbars(renderer) {
        this.renderer = renderer;
        this.containerInside = true;
        this.shown = false;
        this.duration = 350; //ms
        this.collapse = false;
        this.showClass = false;
        this.collapsing = false;
    }
    Navbars.prototype.ngAfterViewInit = function () {
        var _this = this;
        //bugfix - bez tego sypie ExpressionChangedAfterItHasBeenCheckedError - https://github.com/angular/angular/issues/6005#issuecomment-165951692
        setTimeout(function () {
            _this.height = _this.el.nativeElement.scrollHeight;
            _this.collapse = true;
        });
    };
    Navbars.prototype.toggle = function (event) {
        event.preventDefault();
        if (!this.collapsing) {
            if (this.shown) {
                this.hide();
            }
            else {
                this.show();
            }
        }
    };
    Navbars.prototype.show = function () {
        var _this = this;
        this.shown = true;
        this.collapse = false;
        this.collapsing = true;
        setTimeout(function () {
            _this.renderer.setElementStyle(_this.el.nativeElement, "height", _this.height + "px");
        }, 10);
        setTimeout(function () {
            _this.collapsing = false;
            _this.collapse = true;
            _this.showClass = true;
        }, this.duration);
    };
    Navbars.prototype.hide = function () {
        var _this = this;
        this.shown = false;
        this.collapse = false;
        this.showClass = false;
        this.collapsing = true;
        setTimeout(function () {
            _this.renderer.setElementStyle(_this.el.nativeElement, "height", "0px");
        }, 10);
        setTimeout(function () {
            _this.collapsing = false;
            _this.collapse = true;
        }, this.duration);
    };
    Object.defineProperty(Navbars.prototype, "displayStyle", {
        get: function () {
            // if(!this.containerInside) {
            // 	return 'flex';
            // } else {
            return '';
            // }
        },
        enumerable: true,
        configurable: true
    });
    Navbars.prototype.onResize = function (event) {
        var _this = this;
        if (event.target.innerWidth < 992) {
            if (!this.shown) {
                this.collapse = false;
                this.renderer.setElementStyle(this.el.nativeElement, "height", "0px");
                this.renderer.setElementStyle(this.el.nativeElement, "opacity", "0");
                setTimeout(function () {
                    _this.height = _this.el.nativeElement.scrollHeight;
                    _this.collapse = true;
                    _this.renderer.setElementStyle(_this.el.nativeElement, "opacity", "");
                }, 4);
            }
        }
        else {
            this.collapsing = false;
            this.shown = false;
            this.showClass = false;
            this.collapse = true;
            this.renderer.setElementStyle(this.el.nativeElement, "height", "");
        }
    };
    return Navbars;
}());
export { Navbars };
Navbars.decorators = [
    { type: Component, args: [{
                selector: 'navbar',
                template: "\n  \t<nav class=\"{{SideClass}}\" #nav>\n\t\t<div [ngClass]=\"{'container': containerInside}\" [ngStyle]=\"{'display': displayStyle}\">\n\t\t\t<button class=\"navbar-toggler navbar-toggler-right\" type=\"button\" class=\"navbar-toggler navbar-toggler-right\" type=\"button\" (click)=\"toggle($event)\" ripple-radius>\n\t\t\t\t<span class=\"navbar-toggler-icon\"></span>\n\t\t\t</button>\n\t\t\t<ng-content select=\"logo\"></ng-content>\n\t\t\t<div #navbar [style.height]=\"height\" class=\"navbar-collapse\" [ngClass]=\"{'collapse': collapse, 'show': showClass, 'collapsing': collapsing}\">\n\t\t\t\t<ng-content select=\"links\" ></ng-content>\n\t\t\t</div>\n\t\t</div>\n\t</nav>\n  "
            },] },
];
/** @nocollapse */
Navbars.ctorParameters = function () { return [
    { type: Renderer, },
]; };
Navbars.propDecorators = {
    'SideClass': [{ type: Input },],
    'containerInside': [{ type: Input },],
    'el': [{ type: ViewChild, args: ['navbar',] },],
    'mobile': [{ type: ViewChild, args: ['mobile',] },],
    'navbar': [{ type: ViewChild, args: ['nav',] },],
    'onResize': [{ type: HostListener, args: ['window:resize', ['$event'],] },],
};
//# sourceMappingURL=navbarComponent.js.map