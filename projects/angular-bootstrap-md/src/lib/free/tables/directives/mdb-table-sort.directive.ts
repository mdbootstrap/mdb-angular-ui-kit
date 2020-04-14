import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
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
export class MdbTableSortDirective implements OnInit, AfterViewInit {
  data: any[] = [];
  sortedInto = true;
  order: SortDirection.ASC | SortDirection.DESC | SortDirection.CONST = SortDirection.CONST;

  @Input('mdbTableSort') dataSource: Array<any> = [];
  @Input() sortBy: string;
  @Input() sortIcon = false;
  @Input() resetSortDirection = false;
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

    this.removeSort();
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

    const setAria = (
      sort: SortDirection.ASC | SortDirection.CONST | SortDirection.DESC,
      id: any
    ) => {
      if (ariaPass) {
        let nextSortType = '';

        if (this.resetSortDirection) {
          if (sort === SortDirection.CONST) {
            nextSortType = SortDirection.DESC;
          } else if (sort === SortDirection.DESC) {
            nextSortType = SortDirection.ASC;
          } else if (sort === SortDirection.ASC) {
            nextSortType = SortDirection.CONST;
          }
        } else {
          if (sort === SortDirection.DESC) {
            nextSortType = SortDirection.ASC;
          } else if (sort === SortDirection.ASC) {
            nextSortType = SortDirection.DESC;
          }
        }

        this.renderer.setAttribute(this.el.nativeElement, 'aria-sort', sort);
        this.renderer.setAttribute(
          this.el.nativeElement,
          'aria-label',
          `${id}: activate to sort column ${nextSortType}`
        );
        ariaPass = false;
      }
    };

    key = key.split('.');

    if (this.resetSortDirection) {
      const sortFn = (a: any, b: any) => {
        a = a[key];
        b = b[key];

        return a > b ? -1 : 1;
      };
      if (this.order === SortDirection.CONST) {
        setAria(SortDirection.DESC, key);
        this.order = SortDirection.DESC;
        this.dataSource.sort(sortFn);
      } else if (this.order === SortDirection.DESC) {
        setAria(SortDirection.ASC, key);
        this.order = SortDirection.ASC;
        this.dataSource.sort(sortFn).reverse();
      } else if (this.order === SortDirection.ASC) {
        setAria(SortDirection.CONST, key);
        this.order = SortDirection.CONST;
        this.data.map((el: any, index: number) => {
          this.dataSource[index] = el;
        });
      }
    } else {
      this.dataSource.sort((a: any, b: any) => {
        let i = 0;
        while (i < key.length) {
          a = a[key[i]];
          b = b[key[i]];
          i++;
        }

        if (a < b) {
          setAria(SortDirection.ASC, key);
          this.order = SortDirection.ASC;

          return this.sortedInto ? 1 : -1;
        } else if (a > b) {
          setAria(SortDirection.DESC, key);
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
  }

  ngOnInit() {
    const key = this.trimWhiteSigns(this.sortBy.toString()).split('.');

    this.renderer.setAttribute(
      this.el.nativeElement,
      'aria-label',
      `${key}: activate to sort column descending`
    );

    if (this.data.length === 0) {
      // this.dataSource.map((element: any) => {
      //   this.data.push(element);
      // })

      this.data = Array.from(this.dataSource);
    }
  }

  ngAfterViewInit() {
    if (this.sortIcon) {
      this.createIcon();
    }
  }

  createIcon() {
    // tslint:disable-next-line:max-line-length
    const iconUp = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-w-14 ascending" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"></path></svg>`;

    // tslint:disable-next-line:max-line-length
    const iconDown = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" class="svg-inline--fa fa-arrow-down fa-w-14 descending" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg>`;

    const title = this.el.nativeElement.innerHTML;
    this.el.nativeElement.innerHTML = `${title} ${iconUp} ${iconDown}`;
  }

  removeSort() {
    const nodes = this.el.nativeElement.parentElement.childNodes;
    if (nodes) {
      Array.from(nodes).map((node: HTMLElement) => {
        if (node !== this.el.nativeElement && node.nodeName !== '#comment') {
          this.renderer.removeAttribute(node, 'aria-sort');
        }
      });
    }
  }
}
