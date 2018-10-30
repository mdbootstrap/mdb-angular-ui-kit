import { Observable } from 'rxjs';
export declare class MdbTableService {
    private _dataSource;
    constructor();
    addRow(newRow: any): void;
    addRowAfter(index: number, row: any): void;
    removeRow(index: number): void;
    rowRemoved(): Observable<boolean>;
    removeLastRow(): void;
    setDataSource(data: any): void;
    getDataSource(): any;
    dataSourceChange(): Observable<any>;
    filterLocalDataBy(searchKey: any): any;
    searchLocalDataBy(searchKey: any): any;
    searchDataObservable(searchKey: any): Observable<any>;
}
