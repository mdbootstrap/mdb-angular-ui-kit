// todo: add animations when https://github.com/angular/angular/issues/9947 solved
import { Directive, ElementRef, EventEmitter, Input, Output, Renderer } from '@angular/core';
var CollapseDirective = (function () {
    function CollapseDirective(_el, _renderer) {
        this.showBsCollapse = new EventEmitter();
        this.shownBsCollapse = new EventEmitter();
        this.hideBsCollapse = new EventEmitter();
        this.hiddenBsCollapse = new EventEmitter();
        /** This event fires as soon as content collapses */
        this.collapsed = new EventEmitter();
        /** This event fires as soon as content becomes visible */
        this.expanded = new EventEmitter();
        // shown
        // @HostBinding('class.in')
        // @HostBinding('class.show')
        // @HostBinding('attr.aria-expanded')
        this.isExpanded = true;
        // hidden
        // @HostBinding('attr.aria-hidden')
        this.isCollapsed = false;
        // stale state
        // @HostBinding('class.collapse')
        this.isCollapse = true;
        // animation state
        // @HostBinding('class.collapsing')
        this.isCollapsing = false;
        this.collapsing = false;
        this.animationTime = 500;
        this._el = _el;
        this._renderer = _renderer;
    }
    CollapseDirective.prototype.ngOnInit = function () {
        this._el.nativeElement.classList.add("show");
        this.maxHeight = this._el.nativeElement.scrollHeight;
        this._el.nativeElement.style.transition = this.animationTime + "ms ease";
        if (!this.collapse) {
            this._el.nativeElement.classList.remove("show");
            this.hide();
        }
        else {
            this.show();
        }
        this.isExpanded = this.collapse;
    };
    /** allows to manually toggle content visibility */
    CollapseDirective.prototype.toggle = function () {
        if (!this.collapsing) {
            if (this.isExpanded) {
                this.hide();
            }
            else {
                this.show();
            }
        }
    };
    /** allows to manually hide content */
    CollapseDirective.prototype.hide = function () {
        var _this = this;
        this.collapsing = true;
        this.hideBsCollapse.emit();
        this.isCollapse = false;
        this.isCollapsing = true;
        this.isExpanded = false;
        this.isCollapsed = true;
        var container = this._el.nativeElement;
        container.classList.remove("collapse");
        container.classList.remove("show");
        container.classList.add("collapsing");
        this._renderer.setElementStyle(container, "height", "0px");
        setTimeout(function () {
            container.classList.remove("collapsing");
            container.classList.add("collapse");
            _this.hiddenBsCollapse.emit();
            _this.collapsing = false;
        }, this.animationTime);
        this.collapsed.emit(this);
    };
    /** allows to manually show collapsed content */
    CollapseDirective.prototype.show = function () {
        var _this = this;
        if (!this.isExpanded) {
            this.collapsing = true;
            this.showBsCollapse.emit();
            this.isCollapse = false;
            this.isCollapsing = true;
            this.isExpanded = true;
            this.isCollapsed = false;
            var container_1 = this._el.nativeElement;
            container_1.classList.remove("collapse");
            container_1.classList.add("collapsing");
            setTimeout(function () {
                _this._renderer.setElementStyle(container_1, "height", _this.maxHeight + "px");
            }, 10);
            setTimeout(function () {
                container_1.classList.remove("collapsing");
                container_1.classList.add("collapse");
                container_1.classList.add("show");
                _this.shownBsCollapse.emit();
                _this.collapsing = false;
            }, this.animationTime - (this.animationTime * 0.5));
            this.expanded.emit(this);
        }
    };
    return CollapseDirective;
}());
export { CollapseDirective };
CollapseDirective.decorators = [
    { type: Directive, args: [{
                selector: '[collapse]',
                exportAs: 'bs-collapse',
            },] },
];
/** @nocollapse */
CollapseDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
]; };
CollapseDirective.propDecorators = {
    'showBsCollapse': [{ type: Output, args: ['showBsCollapse',] },],
    'shownBsCollapse': [{ type: Output, args: ['shownBsCollapse',] },],
    'hideBsCollapse': [{ type: Output, args: ['hideBsCollapse',] },],
    'hiddenBsCollapse': [{ type: Output, args: ['hiddenBsCollapse',] },],
    'collapsed': [{ type: Output },],
    'expanded': [{ type: Output },],
    'collapse': [{ type: Input },],
    'animationTime': [{ type: Input },],
};
//# sourceMappingURL=collapseDirective.js.map