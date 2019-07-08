import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[mdbTableScroll]',
})
export class MdbTableScrollDirective implements OnInit {
  @Input() scrollY = false;
  @Input() maxHeight: any = null;

  @Input() scrollX = false;
  @Input() maxWidth: any = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  wrapTableWithVerticalScrollingWrapper(tableWrapper: ElementRef) {
    this.renderer.setStyle(tableWrapper, 'max-height', this.maxHeight + 'px');
    this.renderer.setStyle(tableWrapper, 'overflow-y', 'auto');
    this.renderer.setStyle(tableWrapper, 'display', 'block');
  }

  wrapTableWithHorizontalScrollingWrapper(tableWrapper: ElementRef) {
    this.renderer.setStyle(tableWrapper, 'max-width', this.maxWidth + 'px');
    this.renderer.setStyle(tableWrapper, 'overflow-x', 'auto');
    this.renderer.setStyle(tableWrapper, 'display', 'block');
  }

  wrapTableWithHorizontalAndVerticalScrollingWrapper(tableWrapper: ElementRef) {
    this.renderer.setStyle(tableWrapper, 'max-height', this.maxHeight + 'px');
    this.renderer.setStyle(tableWrapper, 'max-width', this.maxWidth + 'px');
    this.renderer.setStyle(tableWrapper, 'overflow-x', 'auto');
    this.renderer.setStyle(tableWrapper, 'display', 'block');
  }

  ngOnInit() {
    const parent = this.el.nativeElement.parentNode;
    const tableWrapper = this.renderer.createElement('div');

    if (this.scrollY && this.scrollX && this.maxHeight && this.maxWidth) {
      this.wrapTableWithHorizontalAndVerticalScrollingWrapper(tableWrapper);
    }

    if (this.scrollY && this.maxHeight) {
      this.wrapTableWithVerticalScrollingWrapper(tableWrapper);
    }

    if (this.scrollX && this.maxWidth) {
      this.wrapTableWithHorizontalScrollingWrapper(tableWrapper);
    }

    this.renderer.insertBefore(parent, tableWrapper, this.el.nativeElement);
    this.renderer.removeChild(parent, this.el.nativeElement);
    this.renderer.appendChild(tableWrapper, this.el.nativeElement);
  }
}
