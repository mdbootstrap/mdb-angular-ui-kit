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

  filterLocalDataBy(searchKey: string) {
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

  filterLocalDataByFields(searchKey: string, keys: string[]) {
    return this.getDataSource().filter((obj: Array<any>) => {
      return Object.keys(obj).some((key: any) => {
        if (obj[key]) {
          if (keys.includes(key)) {
            if (obj[key].toLowerCase().includes(searchKey)) {
              return obj[key];
            }
          }
        }
      });
    });
  }
  filterLocalDataByMultipleFields(searchKey: string, keys?: string[]) {
    const items = searchKey.split(' ').map((x: { toLowerCase: () => void }) => x.toLowerCase());
    return this.getDataSource().filter((x: Array<any>) => {
      for (const item of items) {
        let flag = false;

        if (keys !== undefined) {
          for (const prop in x) {
            if (x[prop]) {
              if (keys.includes(prop)) {
                if (x[prop].toLowerCase().indexOf(item) !== -1) {
                  flag = true;
                  break;
                }
              }
            }
          }
        }
        if (keys === undefined) {
          for (const prop in x) {
            if (x[prop].toLowerCase().indexOf(item) !== -1) {
              flag = true;
              break;
            }
          }
        }
        if (!flag) {
          return false;
        }
      }
      return true;
    });
  }
  searchLocalDataBy(searchKey: string) {
    if (!searchKey) {
      return this.getDataSource();
    }

    if (searchKey) {
      return this.filterLocalDataBy(searchKey.toLowerCase());
    }
  }

  searchLocalDataByFields(searchKey: string, keys: string[]) {
    if (!searchKey) {
      return this.getDataSource();
    }

    if (searchKey && keys.length > 0) {
      return this.filterLocalDataByFields(searchKey.toLowerCase(), keys);
    }
    if (!keys || keys.length === 0) {
      return this.filterLocalDataBy(searchKey.toLowerCase());
    }
  }
  searchLocalDataByMultipleFields(searchKey: string, keys?: string[]) {
    if (!searchKey) {
      return this.getDataSource();
    }
    if (searchKey && keys !== undefined) {
      return this.filterLocalDataByMultipleFields(searchKey.toLowerCase(), keys);
    }
  }
  searchDataObservable(searchKey: string): Observable<any> {
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
