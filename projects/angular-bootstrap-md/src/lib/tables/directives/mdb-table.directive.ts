import { Directive, OnInit, Renderer2, ElementRef, Input, HostBinding } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Directive({
  selector: '[mdbTable]',
  exportAs: 'mdbTable'
})
export class MdbTableDirective implements OnInit {
  @Input()
  @HostBinding('class.table-striped') striped: boolean;

  @Input()
  @HostBinding('class.table-bordered') bordered: boolean;

  @Input()
  @HostBinding('class.table-borderless') borderless: boolean;

  @Input()
  @HostBinding('class.table-hover') hover: boolean;

  @Input()
  @HostBinding('class.table-sm') small: boolean;

  @Input()
  @HostBinding('class.table-responsive') responsive: boolean;

  @Input() stickyHeader: boolean = false;
  @Input() stickyHeaderBgColor: string = '';
  @Input() stickyHeaderTextColor: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  private _dataSource: any = [];
  private _dataSourceChanged: Subject<any> = new Subject<any>();

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
          return (obj[key].toString().toLowerCase()).includes(searchKey);
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
    const observable = Observable.create((observer: any) => {
      observer.next(this.searchLocalDataBy(searchKey));
    });
    return observable;
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'table');

    if (this.stickyHeader) {
      const tableHead = this.el.nativeElement.querySelector('thead');
      this.renderer.addClass(tableHead, 'sticky-top');
      if (this.stickyHeaderBgColor) {
        this.renderer.setStyle(tableHead, 'background-color', this.stickyHeaderBgColor);
      } else {
        this.renderer.setStyle(tableHead, 'background-color', '#f2f2f2');
      }
      if (this.stickyHeaderTextColor) {
        this.renderer.setStyle(tableHead, 'color', this.stickyHeaderTextColor);
      } else {
        this.renderer.setStyle(tableHead, 'color', '#000000');
      }
    }
  }

}
