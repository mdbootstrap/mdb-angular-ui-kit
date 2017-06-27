import {Http} from "@angular/http";

import {LocalData} from "./localDataService";
import {RemoteData} from "./remoteDataService";


export function localDataFactory () {
    return () => {
        return new LocalData();
    };
}

export function remoteDataFactory (http: Http) {
    return () => {
        return new RemoteData(http);
    };
}

export let LocalDataFactoryProvider = {provide: LocalData, useFactory: localDataFactory};
export let RemoteDataFactoryProvider = {provide: RemoteData, useFactory: remoteDataFactory, deps: [Http]};