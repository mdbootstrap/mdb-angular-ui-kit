
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MdbTableService {
  private _dataSource: any = [];

  constructor() { }

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
    const rowRemoved = Observable.create((observer: any) => {
      observer.next(true);
    });
    return rowRemoved;
  }

  removeLastRow() {
    this.getDataSource().pop();
  }

  setDataSource(data: any) {
    this._dataSource = data;
  }

  getDataSource() {
    return this._dataSource;
  }

  dataSourceChange(): Observable<any> {
    const dataSourceChanged = Observable.create((observer: any) => {
      observer.next(this.getDataSource());
    });
    return dataSourceChanged;
  }

  filterLocalDataBy(searchKey: any) {
    return this.getDataSource().filter((obj: Array<any>) => {
      return Object.keys(obj).some((key: any) => {
        return (obj[key].toLowerCase()).includes(searchKey);
      });
    });
  }

  searchLocalDataBy(searchKey: any) {
    if (!searchKey) {
      return this.getDataSource();
    }

    if (searchKey) {
      return this.filterLocalDataBy(searchKey);
    }
  }

  searchDataObservable(searchKey: any): Observable<any> {
    const observable = Observable.create((observer: any) => {
      observer.next(this.searchLocalDataBy(searchKey));
    });
    return observable;
  }

}
