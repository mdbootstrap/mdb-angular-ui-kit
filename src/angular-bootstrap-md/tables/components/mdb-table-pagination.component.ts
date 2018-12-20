import {
  Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, OnChanges,
  SimpleChanges
} from '@angular/core';
import { MdbTableService } from '../services/mdb-table.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'mdb-table-pagination',
  templateUrl: './mdb-table-pagination.component.html'
})
export class MdbTablePaginationComponent implements OnInit, OnChanges {
  @Input() searchPagination: boolean = false;
  @Input() searchDataSource: any = null;

  @Input() paginationAlign: string = '';
  @Input() hideDescription: boolean = false;

  maxVisibleItems: number = 10;

  firstItemIndex: number = 0;
  lastItemIndex: number = this.maxVisibleItems;
  lastVisibleItemIndex: number = 5;

  activePageNumber: number = 1;

  allItemsLength: number = 0;

  nextShouldBeDisabled: boolean = false;
  previousShouldBeDisabled: boolean = true;

  searchText: string = '';

  pagination: Subject<{ first: number, last: number }> = new Subject<{ first: number, last: number }>();

  @Output() nextPageClick = new EventEmitter<any>();
  @Output() previousPageClick = new EventEmitter<any>();

  constructor(
    private tableService: MdbTableService,
    private cdRef: ChangeDetectorRef
  ) {
    this.tableService.dataSourceChange().subscribe((data: any) => {
      this.allItemsLength = data.length;
      this.lastVisibleItemIndex = data.length;
      this.calculateFirstItemIndex();
      this.calculateLastItemIndex();
      this.disableNextButton(data);
      if (this.maxVisibleItems > this.allItemsLength) {
          this.maxVisibleItems = this.allItemsLength;
        }

    });
  }

  ngOnInit() {
    this.allItemsLength = this.tableService.getDataSource().length;
  }


  ngOnChanges(changes: SimpleChanges) {
    const searchDataSource = changes['searchDataSource'];
    if (searchDataSource.currentValue.length !== 0) {
      this.allItemsLength = searchDataSource.currentValue.length;
    }

    if (this.lastVisibleItemIndex > this.allItemsLength) {
      this.lastVisibleItemIndex = this.allItemsLength;
    }

    if (searchDataSource.currentValue.length === 0) {
      this.firstItemIndex = 0;
      this.lastItemIndex = 0;
      this.lastVisibleItemIndex = 0;
      this.allItemsLength = 0;
    } else {
      this.lastVisibleItemIndex = this.maxVisibleItems;
    }

    if (searchDataSource.currentValue.length <= this.maxVisibleItems) {
      this.nextShouldBeDisabled = true;
      this.lastVisibleItemIndex = searchDataSource.currentValue.length;
    } else {
      this.nextShouldBeDisabled = false;
    }

  }

  setMaxVisibleItemsNumberTo(value: number) {
    this.lastItemIndex = value;
    this.lastVisibleItemIndex = value;
    this.maxVisibleItems = value;
    this.cdRef.detectChanges();
  }

  searchTextObs(): Observable<any> {
    const observable = Observable.create((observer: any) => {
      observer.next(this.searchText);
    });
    return observable;
  }

  disableNextButton(data: any) {
    if (data.length <= this.maxVisibleItems) {
      this.nextShouldBeDisabled = true;
    } else {
      this.nextShouldBeDisabled = false;
    }
  }

  calculateFirstItemIndex() {
    this.firstItemIndex = this.activePageNumber * this.maxVisibleItems - this.maxVisibleItems + 1;
    this.pagination.next({ first: this.firstItemIndex, last: this.lastItemIndex });
  }

  calculateLastItemIndex() {
    this.lastItemIndex = this.activePageNumber * this.maxVisibleItems;
    this.lastVisibleItemIndex = this.lastItemIndex;

    if (this.searchDataSource && (this.lastItemIndex > this.searchDataSource.length)) {
      this.lastVisibleItemIndex = this.searchDataSource.length;
    } else if (!this.searchDataSource) {
      this.lastVisibleItemIndex = this.lastItemIndex;
    }

    if (this.lastItemIndex > this.tableService.getDataSource().length) {
      this.lastItemIndex = this.tableService.getDataSource().length;
      this.lastVisibleItemIndex = this.tableService.getDataSource().length;
    }

    this.pagination.next({ first: this.firstItemIndex, last: this.lastItemIndex });
  }

  paginationChange(): Observable<any> {
    return this.pagination;
  }

  calculateHowManyPagesShouldBe() {
    return Math.ceil(this.tableService.getDataSource().length / this.maxVisibleItems);
  }

  previousPage() {
    this.activePageNumber--;
    this.calculateFirstItemIndex();
    this.calculateLastItemIndex();
    this.previousPageClick.emit({ first: this.firstItemIndex, last: this.lastItemIndex });
  }

  nextPage() {
    this.activePageNumber++;
    this.calculateFirstItemIndex();
    this.calculateLastItemIndex();

    if (this.lastItemIndex > this.tableService.getDataSource().length) {
      this.lastItemIndex = this.tableService.getDataSource().length;
    }

    if (this.lastVisibleItemIndex > this.allItemsLength) {
      this.lastVisibleItemIndex = this.allItemsLength;
    }

    this.nextPageClick.emit({ first: this.firstItemIndex, last: this.lastItemIndex });
  }

  nextPageObservable(): Observable<any> {
    const obs = Observable.create((observer: any) => {
      observer.next(this.firstItemIndex);
    });
    return obs;
  }

  previousPageObservable(): Observable<any> {
    const obs = Observable.create((observer: any) => {
      observer.next(this.lastVisibleItemIndex);
    });
    return obs;
  }

  checkIfNextShouldBeDisabled() {
    if (this.searchDataSource && (this.lastVisibleItemIndex === this.searchDataSource.length)) {
      return true;
    }

    if (this.activePageNumber >= this.calculateHowManyPagesShouldBe()) {
      return true;
    }

    if (this.nextShouldBeDisabled) {
      return this.nextShouldBeDisabled;
    }
  }

  checkIfPreviousShouldBeDisabled() {
    if (this.activePageNumber === 1) {
      return true;
    }
  }

}
