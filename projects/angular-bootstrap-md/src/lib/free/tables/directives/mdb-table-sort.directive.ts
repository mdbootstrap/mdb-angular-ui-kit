import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ElementRef,
  Renderer2,
  OnInit,
} from '@angular/core';

enum SortDirection {
  ASC = 'ascending',
  DESC = 'descending',
  CONST = 'constant',
}

export interface SortedData {
  data: any[];
  sortOrder: string;
  sortBy: string;
}

@Directive({
  selector: '[mdbTableSort]',
})
export class MdbTableSortDirective implements OnInit {
  sortedInto = true;
  order: string;

  @Input('mdbTableSort') dataSource: Array<any> = [];
  @Input() sortBy: string;

  @Output() sortEnd: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() sorted: EventEmitter<SortedData> = new EventEmitter<SortedData>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onclick() {
    this.sortDataBy(this.trimWhiteSigns(this.sortBy.toString()));
    this.sortEnd.emit(this.dataSource);
    this.sorted.emit({
      data: this.dataSource,
      sortOrder: this.order,
      sortBy: this.sortBy,
    });
  }

  trimWhiteSigns(headElement: any): string {
    return headElement.replace(/ /g, '');
  }

  public moveArrayItem(arr: any, oldIndex: number, newIndex: number) {
    while (oldIndex < 0) {
      oldIndex += arr.length;
    }
    while (newIndex < 0) {
      newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length;
      while (k-- + 1) {
        arr.push(null);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  sortDataBy(key: string | any) {
    let ariaPass = true;

    const setAria = (sort: 'ascending' | 'descending', id: any) => {
      if (ariaPass) {
        const inverse = sort === 'ascending' ? 'descending' : 'ascending';

        this.renderer.setAttribute(this.el.nativeElement, 'aria-sort', sort);
        this.renderer.setAttribute(
          this.el.nativeElement,
          'aria-label',
          `${id}: activate to sort column ${inverse}`
        );
        ariaPass = false;
      }
    };

    key = key.split('.');

    this.dataSource.sort((a: any, b: any) => {
      let i = 0;
      while (i < key.length) {
        a = a[key[i]];
        b = b[key[i]];
        i++;
      }

      if (a < b) {
        setAria('ascending', key);
        this.order = SortDirection.ASC;

        return this.sortedInto ? 1 : -1;
      } else if (a > b) {
        setAria('descending', key);
        this.order = SortDirection.DESC;

        return this.sortedInto ? -1 : 1;
      } else if (a == null || b == null) {
        this.order = SortDirection.CONST;
        return 1;
      } else {
        this.order = SortDirection.CONST;
        return 0;
      }
    });

    this.sortedInto = !this.sortedInto;
  }

  ngOnInit() {
    const key = this.trimWhiteSigns(this.sortBy.toString()).split('.');
    this.renderer.setAttribute(
      this.el.nativeElement,
      'aria-label',
      `${key}: activate to sort column descending`
    );
  }
}
