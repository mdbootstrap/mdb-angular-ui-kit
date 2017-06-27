import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SebmGoogleMapPolyline } from '../../directives/google-map-polyline';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
export declare class PolylineManager {
    private _mapsWrapper;
    private _zone;
    private _polylines;
    constructor(_mapsWrapper: GoogleMapsAPIWrapper, _zone: NgZone);
    private static _convertPoints(line);
    addPolyline(line: SebmGoogleMapPolyline): void;
    updatePolylinePoints(line: SebmGoogleMapPolyline): Promise<void>;
    setPolylineOptions(line: SebmGoogleMapPolyline, options: {
        [propName: string]: any;
    }): Promise<void>;
    deletePolyline(line: SebmGoogleMapPolyline): Promise<void>;
    createEventObservable<T>(eventName: string, line: SebmGoogleMapPolyline): Observable<T>;
}
