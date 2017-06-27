import {Observable} from "rxjs/Observable";

import {CompleterItem} from "../components/completerItemComponent";

export interface CompleterData extends Observable<CompleterItem[]> {
    search(term: string): void;
    cancel(): void;
    convertToItem?(data: any): CompleterItem;
};