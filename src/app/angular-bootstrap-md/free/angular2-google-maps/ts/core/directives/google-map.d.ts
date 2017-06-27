import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { MouseEvent } from '../map-types';
import { GoogleMapsAPIWrapper } from '../services/google-maps-api-wrapper';
import { LatLngLiteral } from '../services/google-maps-types';
import { LatLngBounds, LatLngBoundsLiteral, MapTypeStyle } from '../services/google-maps-types';
/**
 * SebMGoogleMap renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the CSS
 * class `sebm-google-map-container`.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 * import { SebmGoogleMap } from 'angular2-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [SebmGoogleMap],
 *  styles: [`
 *    .sebm-google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <sebm-google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *    </sebm-google-map>
 *  `
 * })
 * ```
 */
export declare class SebmGoogleMap implements OnChanges, OnInit, OnDestroy {
    private _elem;
    private _mapsWrapper;
    /**
     * The longitude that defines the center of the map.
     */
    longitude: number;
    /**
     * The latitude that defines the center of the map.
     */
    latitude: number;
    /**
     * The zoom level of the map. The default zoom level is 8.
     */
    zoom: number;
    /**
     * The minimal zoom level of the map allowed. When not provided, no restrictions to the zoom level
     * are enforced.
     */
    minZoom: number;
    /**
     * The maximal zoom level of the map allowed. When not provided, no restrictions to the zoom level
     * are enforced.
     */
    maxZoom: number;
    /**
     * Enables/disables if map is draggable.
     */
    draggable: boolean;
    /**
     * Enables/disables zoom and center on double click. Enabled by default.
     */
    disableDoubleClickZoom: boolean;
    /**
     * Enables/disables all default UI of the Google map. Please note: When the map is created, this
     * value cannot get updated.
     */
    disableDefaultUI: boolean;
    /**
     * If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by default.
     */
    scrollwheel: boolean;
    /**
     * Color used for the background of the Map div. This color will be visible when tiles have not
     * yet loaded as the user pans. This option can only be set when the map is initialized.
     */
    backgroundColor: string;
    /**
     * The name or url of the cursor to display when mousing over a draggable map. This property uses
     * the css  * cursor attribute to change the icon. As with the css property, you must specify at
     * least one fallback cursor that is not a URL. For example:
     * [draggableCursor]="'url(http://www.example.com/icon.png), auto;'"
     */
    draggableCursor: string;
    /**
     * The name or url of the cursor to display when the map is being dragged. This property uses the
     * css cursor attribute to change the icon. As with the css property, you must specify at least
     * one fallback cursor that is not a URL. For example:
     * [draggingCursor]="'url(http://www.example.com/icon.png), auto;'"
     */
    draggingCursor: string;
    /**
     * If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are
     * enabled by default.
     */
    keyboardShortcuts: boolean;
    /**
     * The enabled/disabled state of the Zoom control.
     */
    zoomControl: boolean;
    /**
     * Styles to apply to each of the default map types. Note that for Satellite/Hybrid and Terrain
     * modes, these styles will only apply to labels and geometry.
     */
    styles: MapTypeStyle[];
    /**
     * When true and the latitude and/or longitude values changes, the Google Maps panTo method is
     * used to
     * center the map. See: https://developers.google.com/maps/documentation/javascript/reference#Map
     */
    usePanning: boolean;
    /**
     * The initial enabled/disabled state of the Street View Pegman control.
     * This control is part of the default UI, and should be set to false when displaying a map type
     * on which the Street View road overlay should not appear (e.g. a non-Earth map type).
     */
    streetViewControl: boolean;
    /**
     * Sets the viewport to contain the given bounds.
     */
    fitBounds: LatLngBoundsLiteral | LatLngBounds;
    /**
     * The initial enabled/disabled state of the Scale control. This is disabled by default.
     */
    scaleControl: boolean;
    /**
     * The initial enabled/disabled state of the Map type control.
     */
    mapTypeControl: boolean;
    /**
     * Map option attributes that can change over time
     */
    private static _mapOptionsAttributes;
    private _observableSubscriptions;
    /**
     * This event emitter gets emitted when the user clicks on the map (but not when they click on a
     * marker or infoWindow).
     */
    mapClick: EventEmitter<MouseEvent>;
    /**
     * This event emitter gets emitted when the user right-clicks on the map (but not when they click
     * on a marker or infoWindow).
     */
    mapRightClick: EventEmitter<MouseEvent>;
    /**
     * This event emitter gets emitted when the user double-clicks on the map (but not when they click
     * on a marker or infoWindow).
     */
    mapDblClick: EventEmitter<MouseEvent>;
    /**
     * This event emitter is fired when the map center changes.
     */
    centerChange: EventEmitter<LatLngLiteral>;
    /**
     * This event is fired when the viewport bounds have changed.
     */
    boundsChange: EventEmitter<LatLngBounds>;
    /**
     * This event is fired when the map becomes idle after panning or zooming.
     */
    idle: EventEmitter<void>;
    /**
     * This event is fired when the zoom level has changed.
     */
    zoomChange: EventEmitter<number>;
    constructor(_elem: ElementRef, _mapsWrapper: GoogleMapsAPIWrapper);
    ngOnInit(): void;
    private _initMapInstance(el);
    ngOnDestroy(): void;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): void;
    private _updateMapOptionsChanges(changes);
    /**
     * Triggers a resize event on the google map instance.
     * Returns a promise that gets resolved after the event was triggered.
     */
    triggerResize(): Promise<void>;
    private _updatePosition(changes);
    private _fitBounds();
    private _handleMapCenterChange();
    private _handleBoundsChange();
    private _handleMapZoomChange();
    private _handleIdleEvent();
    private _handleMapMouseEvents();
}
