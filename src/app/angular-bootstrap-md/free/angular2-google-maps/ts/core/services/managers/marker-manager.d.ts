import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SebmGoogleMapMarker } from './../../directives/google-map-marker';
import { GoogleMapsAPIWrapper } from './../google-maps-api-wrapper';
import { Marker } from './../google-maps-types';
export declare class MarkerManager {
    private _mapsWrapper;
    private _zone;
    private _markers;
    constructor(_mapsWrapper: GoogleMapsAPIWrapper, _zone: NgZone);
    deleteMarker(marker: SebmGoogleMapMarker): Promise<void>;
    updateMarkerPosition(marker: SebmGoogleMapMarker): Promise<void>;
    updateTitle(marker: SebmGoogleMapMarker): Promise<void>;
    updateLabel(marker: SebmGoogleMapMarker): Promise<void>;
    updateDraggable(marker: SebmGoogleMapMarker): Promise<void>;
    updateIcon(marker: SebmGoogleMapMarker): Promise<void>;
    updateOpacity(marker: SebmGoogleMapMarker): Promise<void>;
    updateVisible(marker: SebmGoogleMapMarker): Promise<void>;
    updateZIndex(marker: SebmGoogleMapMarker): Promise<void>;
    addMarker(marker: SebmGoogleMapMarker): void;
    getNativeMarker(marker: SebmGoogleMapMarker): Promise<Marker>;
    createEventObservable<T>(eventName: string, marker: SebmGoogleMapMarker): Observable<T>;
}
