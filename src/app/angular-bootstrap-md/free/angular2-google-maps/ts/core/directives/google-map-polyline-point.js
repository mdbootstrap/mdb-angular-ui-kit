import { Directive, EventEmitter, Input, Output } from '@angular/core';
/**
 * SebmGoogleMapPolylinePoint represents one element of a polyline within a  {@link
 * SembGoogleMapPolyline}
 */
var SebmGoogleMapPolylinePoint = (function () {
    function SebmGoogleMapPolylinePoint() {
        /**
         * This event emitter gets emitted when the position of the point changed.
         */
        this.positionChanged = new EventEmitter();
    }
    SebmGoogleMapPolylinePoint.prototype.ngOnChanges = function (changes) {
        if (changes['latitude'] || changes['longitude']) {
            var position = {
                lat: changes['latitude'].currentValue,
                lng: changes['longitude'].currentValue
            };
            this.positionChanged.emit(position);
        }
    };
    return SebmGoogleMapPolylinePoint;
}());
export { SebmGoogleMapPolylinePoint };
SebmGoogleMapPolylinePoint.decorators = [
    { type: Directive, args: [{ selector: 'sebm-google-map-polyline-point' },] },
];
/** @nocollapse */
SebmGoogleMapPolylinePoint.ctorParameters = function () { return []; };
SebmGoogleMapPolylinePoint.propDecorators = {
    'latitude': [{ type: Input },],
    'longitude': [{ type: Input },],
    'positionChanged': [{ type: Output },],
};
//# sourceMappingURL=google-map-polyline-point.js.map