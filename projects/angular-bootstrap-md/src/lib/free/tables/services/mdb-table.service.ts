import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MdbTableService {
  private _dataSource: any = [];
  private _dataSourceChanged: Subject<any> = new Subject<any>();
  constructor() {}

  addRow(newRow: any) {
    this.getDataSource().push(newRow);
  }

  addRowAfter(index: number, row: any) {
    this.getDataSource().splice(index, 0, row);
  }

  removeRow(index: number) {
    this.getDataSource().splice(index, 1);
  }

  rowRemoved(): Observable<boolean> {
    const rowRemoved = new Observable<boolean>((observer: any) => {
      observer.next(true);
    });
    return rowRemoved;
  }

  removeLastRow() {
    this.getDataSource().pop();
  }

  getDataSource() {
    return this._dataSource;
  }

  setDataSource(data: any) {
    this._dataSource = data;
    this._dataSourceChanged.next(this.getDataSource());
  }

  dataSourceChange(): Observable<any> {
    return this._dataSourceChanged;
  }

  filterLocalDataBy(searchKey: any) {
    return this.getDataSource().filter((obj: Array<any>) => {
      return Object.keys(obj).some((key: any) => {
        if (obj[key]) {
          return obj[key]
            .toString()
            .toLowerCase()
            .includes(searchKey);
        }
      });
    });
  }

  searchLocalDataBy(searchKey: any) {
    if (!searchKey) {
      return this.getDataSource();
    }

    if (searchKey) {
      return this.filterLocalDataBy(searchKey.toLowerCase());
    }
  }

  searchDataObservable(searchKey: any): Observable<any> {
    const observable = new Observable((observer: any) => {
      observer.next(this.searchLocalDataBy(searchKey));
    });
    return observable;
  }
}
