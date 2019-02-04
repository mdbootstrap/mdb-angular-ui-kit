import { Directive, OnInit, Renderer2, ElementRef, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[mdbTable]'
})
export class MdbTableDirective implements OnInit {
  @Input()
  @HostBinding('class.table-striped') striped: boolean;

  @Input()
  @HostBinding('class.table-bordered') bordered: boolean;

  @Input()
  @HostBinding('class.table-borderless') borderless: boolean;

  @Input()
  @HostBinding('class.table-hover') hover: boolean;

  @Input()
  @HostBinding('class.table-sm') small: boolean;

  @Input()
  @HostBinding('class.table-responsive') responsive: boolean;

  @Input() stickyHeader: boolean = false;
  @Input() stickyHeaderBgColor: string = '';
  @Input() stickyHeaderTextColor: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'table');

    if (this.stickyHeader) {
      const tableHead = this.el.nativeElement.querySelector('thead');
      this.renderer.addClass(tableHead, 'sticky-top');
      if (this.stickyHeaderBgColor) {
        this.renderer.setStyle(tableHead, 'background-color', this.stickyHeaderBgColor);
      } else {
        this.renderer.setStyle(tableHead, 'background-color', '#f2f2f2');
      }
      if (this.stickyHeaderTextColor) {
        this.renderer.setStyle(tableHead, 'color', this.stickyHeaderTextColor);
      } else {
        this.renderer.setStyle(tableHead, 'color', '#000000');
      }
    }
  }

}
