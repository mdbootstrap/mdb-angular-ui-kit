import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[mdbTable]',
  exportAs: 'mdbTable',
  template: '<ng-content></ng-content>',
  styleUrls: ['./../tables-module.scss'],
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class MdbTableDirective implements OnInit, AfterViewInit {
  @Input()
  @HostBinding('class.table-striped')
  striped: boolean;

  @Input()
  @HostBinding('class.table-bordered')
  bordered: boolean;

  @Input()
  @HostBinding('class.table-borderless')
  borderless: boolean;

  @Input()
  @HostBinding('class.table-hover')
  hover: boolean;

  @Input()
  @HostBinding('class.table-sm')
  small: boolean;

  @Input()
  @HostBinding('class.table-responsive')
  responsive: boolean;

  @Input() stickyHeader = false;
  @Input() stickyHeaderBgColor = '';
  @Input() stickyHeaderTextColor = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

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
          // Fix(tableSearch): table search will now able to filter through nested data
          return JSON.stringify(obj)
            .toLowerCase()
            .includes(searchKey) as any;
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

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'table');
  }

  ngAfterViewInit() {
    // Fix(stickyHeader): resolved problem with not working stickyHeader="true" on Chrome
    if (this.stickyHeader) {
      const tableHead = this.el.nativeElement.querySelector('thead');

      Array.from(tableHead.firstElementChild.children).forEach((child: any) => {
        this.renderer.addClass(child, 'sticky-top');
        if (this.stickyHeaderBgColor) {
          this.renderer.setStyle(child, 'background-color', this.stickyHeaderBgColor);
        } else {
          this.renderer.setStyle(child, 'background-color', '#f2f2f2');
        }
        if (this.stickyHeaderTextColor) {
          this.renderer.setStyle(child, 'color', this.stickyHeaderTextColor);
        } else {
          this.renderer.setStyle(child, 'color', '#000000');
        }
      });
    }
  }
}
