import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[mdbTableSort]'
})
export class MdbTableSortDirective {

  @Input('mdbTableSort') dataSource: Array<any> = [];

  @Input() sortBy: string;

  sorted = true;

  @HostListener('click') onclick() {
    this.sortDataBy(this.trimWhiteSigns(this.sortBy.toString()));
  }

  constructor() { }

  trimWhiteSigns(headElement: any): string {
    return headElement.replace(/ /g, '');
  }

  sortDataBy(key: string | any) {
    key = key.split('.');

    this.dataSource.sort((a: any, b: any) => {
      let i = 0;
      while ( i < key.length) {
        a = a[key[i]];
        b = b[key[i]];
        i++;
      }

      if (a < b) {
        return this.sorted ? 1 : -1;
      } else if (a > b) {
        return this.sorted ? -1 : 1
      } else {
        return 0;
      }
    });
    this.sorted = !this.sorted;
  }
}
