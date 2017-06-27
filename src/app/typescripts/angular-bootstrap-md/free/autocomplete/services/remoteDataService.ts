import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { CompleterBaseData } from "./baseDataService";
import { CompleterItem } from "../components/completerItemComponent";

export class RemoteData extends CompleterBaseData {
    private _remoteUrl: string;
    private remoteSearch: Subscription;
    private _urlFormater: (term: string) => string = null;
    private _dataField: string = null;
    private _headers: Headers;
    private _requestOptions: RequestOptions;


    constructor(private http: Http) {
        super();
    }

    public remoteUrl(remoteUrl: string) {
        this._remoteUrl = remoteUrl;
        return this;
    }

    public urlFormater(urlFormater: (term: string) => string) {
        this._urlFormater = urlFormater;
    }

    public dataField(dataField: string) {
        this._dataField = dataField;
    }

    /**
     * @deprecated Please use the requestOptions to pass headers with the search request
     */
    public headers(headers: Headers) {
        this._headers = headers;
    }

    public requestOptions(requestOptions: RequestOptions) {
        this._requestOptions = requestOptions;
    }

    public search(term: string): void {
        this.cancel();
        // let params = {};
        let url = "";
        if (this._urlFormater) {
            url = this._urlFormater(term);
        } else {
            url = this._remoteUrl + encodeURIComponent(term);
        }

        /*
         * If requestOptions are provided, they will override anything set in headers.
         *
         * If no requestOptions are provided, a new RequestOptions object will be instantiated,
         * and either the provided headers or a new Headers() object will be sent.
         */
        if (!this._requestOptions) {
            this._requestOptions = new RequestOptions();
            this._requestOptions.headers = this._headers || new Headers();
        }

        this.remoteSearch = this.http.get(url, this._requestOptions)
            .map((res: Response) => res.json())
            .map((data: any) => {
                let matches = this.extractValue(data, this._dataField);
                return this.extractMatches(matches, term);
            })
            .map(
            (matches: any[]) => {
                let results = this.processResults(matches);
                this.next(results);
                return results;
            })
            .catch((err) => {
                this.error(err);
                return null;
            })
            .subscribe();
    }

    public cancel() {
        if (this.remoteSearch) {
            this.remoteSearch.unsubscribe();
        }
    }

    public convertToItem(data: any): CompleterItem {
        return super.convertToItem(data);
    }
}