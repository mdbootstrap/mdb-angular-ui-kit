import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[mdbTableSort]'
})
export class MdbTableSortDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('mdbTableSort') dataSource: Array<any> = [];

  @Input() sortBy: string;

  sorted = false;

  @HostListener('click') onclick() {
    this.sortDataBy(this.sortBy.toLowerCase());
  }
  constructor() { }

  sortDataBy(key: string | any): void {

    this.dataSource.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return this.sorted ? 1 : -1;
      }
      if (a[key] > b[key]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }
}
