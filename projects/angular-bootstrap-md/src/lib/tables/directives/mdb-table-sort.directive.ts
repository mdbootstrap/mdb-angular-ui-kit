import {Directive, EventEmitter, HostListener, Input, Output, ElementRef, Renderer2, OnInit} from '@angular/core';

@Directive({
  selector: '[mdbTableSort]'
})
export class MdbTableSortDirective implements OnInit {
  sorted = true;

  @Input('mdbTableSort') dataSource: Array<any> = [];
  @Input() sortBy: string;

  @Output() sortEnd: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onclick() {
    this.sortDataBy(this.trimWhiteSigns(this.sortBy.toString()));
    this.sortEnd.emit(this.dataSource);
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
      while ((k--) + 1) {
        arr.push(null);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  sortDataBy(key: string | any) {
    key = key.split('.');

    this.dataSource.sort((a: any, b: any) => {
      let i = 0;
      while (i < key.length) {
        a = a[key[i]];
        b = b[key[i]];
        i++;
      }

      if (a < b) {
        this.renderer.setAttribute(this.el.nativeElement, 'aria-sort', 'ascending');
        this.renderer.setAttribute(this.el.nativeElement, 'aria-label', `${key}: activate to sort column descending`);
        return this.sorted ? 1 : -1;
      } else if (a > b) {
        this.renderer.setAttribute(this.el.nativeElement, 'aria-sort', 'descending');
        this.renderer.setAttribute(this.el.nativeElement, 'aria-label', `${key}: activate to sort column ascending`);
        return this.sorted ? -1 : 1;
      } else if (a == null || b == null) {
        return 1;
      } else {
        return 0;
      }
    });
    this.sorted = !this.sorted;
  }

  ngOnInit() {
    const key = this.trimWhiteSigns(this.sortBy.toString()).split('.');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-label', `${key}: activate to sort column descending`);
  }
}
