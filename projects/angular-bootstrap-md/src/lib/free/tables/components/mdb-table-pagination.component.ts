import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MdbTableDirective } from '../directives/mdb-table.directive';

@Component({
  selector: 'mdb-table-pagination',
  templateUrl: './mdb-table-pagination.component.html',
})
export class MdbTablePaginationComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() tableEl: MdbTableDirective;
  @Input() searchPagination = false;
  @Input() searchDataSource: any = null;
  @Input() ofKeyword = 'of';
  @Input() dashKeyword = '-';
  @Input() paginationAlign = '';
  @Input() hideDescription = false;

  maxVisibleItems = 10;

  firstItemIndex = 0;
  lastItemIndex: number = this.maxVisibleItems;
  lastVisibleItemIndex = 5;

  activePageNumber = 1;

  allItemsLength = 0;

  nextShouldBeDisabled = false;
  previousShouldBeDisabled = true;

  searchText = '';

  pagination: Subject<{ first: number; last: number }> = new Subject<{
    first: number;
    last: number;
  }>();

  @Output() nextPageClick = new EventEmitter<any>();
  @Output() previousPageClick = new EventEmitter<any>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.tableEl) {
      this.allItemsLength = this.tableEl.getDataSource().length;
    }
  }

  ngAfterViewInit() {
    if (this.tableEl) {
      this.tableEl.dataSourceChange().subscribe((data: any) => {
        this.allItemsLength = data.length;
        this.lastVisibleItemIndex = data.length;
        this.calculateFirstItemIndex();
        this.calculateLastItemIndex();
        this.disableNextButton(data);

        if (this.searchDataSource) {
          setTimeout(() => {
            if (this.searchDataSource.length !== data.length) {
              this.activePageNumber = 1;
              this.firstItemIndex = 1;
            }
          }, 0);
        }
      });
    }

    this.paginationChange().subscribe((data: any) => {
      this.firstItemIndex = data.first;
      this.lastVisibleItemIndex = data.last;
    });
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
    }

    if (
      !searchDataSource.isFirstChange() &&
      searchDataSource.currentValue.length <= this.maxVisibleItems
    ) {
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
    const observable = new Observable((observer: any) => {
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

    if (this.searchDataSource && this.lastItemIndex > this.searchDataSource.length) {
      this.lastVisibleItemIndex = this.searchDataSource.length;
    } else if (!this.searchDataSource) {
      this.lastVisibleItemIndex = this.lastItemIndex;
    }

    if (this.lastItemIndex > this.tableEl.getDataSource().length) {
      this.lastItemIndex = this.tableEl.getDataSource().length;
      this.lastVisibleItemIndex = this.tableEl.getDataSource().length;
    }

    this.pagination.next({ first: this.firstItemIndex, last: this.lastItemIndex });
  }

  paginationChange(): Observable<any> {
    return this.pagination;
  }

  calculateHowManyPagesShouldBe() {
    return Math.ceil(this.tableEl.getDataSource().length / this.maxVisibleItems);
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

    if (this.lastItemIndex > this.tableEl.getDataSource().length) {
      this.lastItemIndex = this.tableEl.getDataSource().length;
    }

    if (this.lastVisibleItemIndex > this.allItemsLength) {
      this.lastVisibleItemIndex = this.allItemsLength;
    }

    this.nextPageClick.emit({ first: this.firstItemIndex, last: this.lastItemIndex });
  }

  firstPage() {
    this.activePageNumber = 1;
    this.calculateFirstItemIndex();
    this.calculateLastItemIndex();
  }

  lastPage() {
    const lastPage = Math.round(this.allItemsLength / this.maxVisibleItems);
    this.activePageNumber = lastPage;
    this.calculateFirstItemIndex();
    this.calculateLastItemIndex();
  }

  nextPageObservable(): Observable<any> {
    const obs = new Observable((observer: any) => {
      observer.next(this.firstItemIndex);
    });
    return obs;
  }

  previousPageObservable(): Observable<any> {
    const obs = new Observable((observer: any) => {
      observer.next(this.lastVisibleItemIndex);
    });
    return obs;
  }

  checkIfNextShouldBeDisabled() {
    if (this.searchDataSource && this.lastVisibleItemIndex === this.searchDataSource.length) {
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
