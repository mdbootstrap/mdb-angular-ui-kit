import { Directive, Output, EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdbTableRow]'
})
export class MdbTableRowDirective implements OnInit, OnDestroy {

  @Output() rowCreated = new EventEmitter<any>();
  @Output() rowRemoved = new EventEmitter<any>();

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.rowCreated.emit({ created: true, el: this.el.nativeElement });
  }

  ngOnDestroy() {
    this.rowRemoved.emit({ removed: true });
  }

}
