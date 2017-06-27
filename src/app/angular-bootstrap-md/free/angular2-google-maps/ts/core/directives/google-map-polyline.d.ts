import { AfterContentInit, EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { PolyMouseEvent } from '../services/google-maps-types';
import { PolylineManager } from '../services/managers/polyline-manager';
import { SebmGoogleMapPolylinePoint } from './google-map-polyline-point';
/**
 * SebmGoogleMapPolyline renders a polyline on a
 *
 * ### Example
 * ```typescript
 * import { Component } from 'angular2/core';
 * import { SebmGoogleMap, SebmGooglePolyline, SebmGooglePolylinePoint } from
 * 'angular2-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [SebmGoogleMap, SebmGooglePolyline, SebmGooglePolylinePoint],
 *  styles: [`
 *    .sebm-google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <sebm-google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <sebm-google-map-polyline>
 *          <sebm-google-map-polyline-point [latitude]="latA" [longitude]="lngA">
 *          </sebm-google-map-polyline-point>
 *          <sebm-google-map-polyline-point [latitude]="latB" [longitude]="lngB">
 *          </sebm-google-map-polyline-point>
 *      </sebm-google-map-polyline>
 *    </sebm-google-map>
 *  `
 * })
 * ```
 */
export declare class SebmGoogleMapPolyline implements OnDestroy, OnChanges, AfterContentInit {
    private _polylineManager;
    /**
     * Indicates whether this Polyline handles mouse events. Defaults to true.
     */
    clickable: boolean;
    /**
     * If set to true, the user can drag this shape over the map. The geodesic property defines the
     * mode of dragging. Defaults to false.
     */
    draggable: boolean;
    /**
     * If set to true, the user can edit this shape by dragging the control points shown at the
     * vertices and on each segment. Defaults to false.
     */
    editable: boolean;
    /**
     * When true, edges of the polygon are interpreted as geodesic and will follow the curvature of
     * the Earth. When false, edges of the polygon are rendered as straight lines in screen space.
     * Note that the shape of a geodesic polygon may appear to change when dragged, as the dimensions
     * are maintained relative to the surface of the earth. Defaults to false.
     */
    geodesic: boolean;
    /**
     * The stroke color. All CSS3 colors are supported except for extended named colors.
     */
    strokeColor: string;
    /**
     * The stroke opacity between 0.0 and 1.0.
     */
    strokeOpacity: number;
    /**
     * The stroke width in pixels.
     */
    strokeWeight: number;
    /**
     * Whether this polyline is visible on the map. Defaults to true.
     */
    visible: boolean;
    /**
     * The zIndex compared to other polys.
     */
    zIndex: number;
    /**
     * This event is fired when the DOM click event is fired on the Polyline.
     */
    lineClick: EventEmitter<PolyMouseEvent>;
    /**
     * This event is fired when the DOM dblclick event is fired on the Polyline.
     */
    lineDblClick: EventEmitter<PolyMouseEvent>;
    /**
     * This event is repeatedly fired while the user drags the polyline.
     */
    lineDrag: EventEmitter<MouseEvent>;
    /**
     * This event is fired when the user stops dragging the polyline.
     */
    lineDragEnd: EventEmitter<MouseEvent>;
    /**
     * This event is fired when the user starts dragging the polyline.
     */
    lineDragStart: EventEmitter<MouseEvent>;
    /**
     * This event is fired when the DOM mousedown event is fired on the Polyline.
     */
    lineMouseDown: EventEmitter<PolyMouseEvent>;
    /**
     * This event is fired when the DOM mousemove event is fired on the Polyline.
     */
    lineMouseMove: EventEmitter<PolyMouseEvent>;
    /**
     * This event is fired on Polyline mouseout.
     */
    lineMouseOut: EventEmitter<PolyMouseEvent>;
    /**
     * This event is fired on Polyline mouseover.
     */
    lineMouseOver: EventEmitter<PolyMouseEvent>;
    /**
     * This event is fired whe the DOM mouseup event is fired on the Polyline
     */
    lineMouseUp: EventEmitter<PolyMouseEvent>;
    /**
     * This even is fired when the Polyline is right-clicked on.
     */
    lineRightClick: EventEmitter<PolyMouseEvent>;
    private static _polylineOptionsAttributes;
    private _id;
    private _polylineAddedToManager;
    private _subscriptions;
    constructor(_polylineManager: PolylineManager);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): any;
    private _init();
    private _addEventListeners();
    _getPoints(): Array<SebmGoogleMapPolylinePoint>;
    id(): string;
    ngOnDestroy(): void;
}
