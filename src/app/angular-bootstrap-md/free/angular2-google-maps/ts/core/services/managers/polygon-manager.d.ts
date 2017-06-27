import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SebmGoogleMapPolygon } from '../../directives/google-map-polygon';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
export declare class PolygonManager {
    private _mapsWrapper;
    private _zone;
    private _polygons;
    constructor(_mapsWrapper: GoogleMapsAPIWrapper, _zone: NgZone);
    addPolygon(path: SebmGoogleMapPolygon): void;
    updatePolygon(polygon: SebmGoogleMapPolygon): Promise<void>;
    setPolygonOptions(path: SebmGoogleMapPolygon, options: {
        [propName: string]: any;
    }): Promise<void>;
    deletePolygon(paths: SebmGoogleMapPolygon): Promise<void>;
    createEventObservable<T>(eventName: string, path: SebmGoogleMapPolygon): Observable<T>;
}
