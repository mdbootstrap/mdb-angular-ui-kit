import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SebmGoogleMapKmlLayer } from './../../directives/google-map-kml-layer';
import { GoogleMapsAPIWrapper } from './../google-maps-api-wrapper';
import { KmlLayerOptions } from './../google-maps-types';
/**
 * Manages all KML Layers for a Google Map instance.
 */
export declare class KmlLayerManager {
    private _wrapper;
    private _zone;
    private _layers;
    constructor(_wrapper: GoogleMapsAPIWrapper, _zone: NgZone);
    /**
     * Adds a new KML Layer to the map.
     */
    addKmlLayer(layer: SebmGoogleMapKmlLayer): void;
    setOptions(layer: SebmGoogleMapKmlLayer, options: KmlLayerOptions): void;
    deleteKmlLayer(layer: SebmGoogleMapKmlLayer): void;
    /**
     * Creates a Google Maps event listener for the given KmlLayer as an Observable
     */
    createEventObservable<T>(eventName: string, layer: SebmGoogleMapKmlLayer): Observable<T>;
}
