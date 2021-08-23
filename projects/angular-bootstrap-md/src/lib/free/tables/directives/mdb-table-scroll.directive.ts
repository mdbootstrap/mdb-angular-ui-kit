import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[mdbTableScroll]',
})
export class MdbTableScrollDirective implements OnInit {
  @Input() scrollY = false;
  @Input()
  get maxHeight(): number | string | null {
    return this._maxHeight;
  }
  set maxHeight(value: number | string | null) {
    if (typeof value === 'number') {
      this._maxHeight = `${value}px`;
    } else {
      this._maxHeight = value;
    }
  }

  @Input() scrollX = false;
  @Input()
  get maxWidth(): number | string | null {
    return this._maxWidth;
  }
  set maxWidth(value: number | string | null) {
    if (typeof value === 'number') {
      this._maxWidth = `${value}px`;
    } else {
      this._maxWidth = value;
    }
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  _maxWidth: number | string | null;
  _maxHeight: number | string | null;

  wrapTableWithVerticalScrollingWrapper(tableWrapper: ElementRef) {
    this.renderer.setStyle(tableWrapper, 'max-height', this.maxHeight);
    this.renderer.setStyle(tableWrapper, 'overflow-y', 'auto');
    this.renderer.setStyle(tableWrapper, 'display', 'block');
  }

  wrapTableWithHorizontalScrollingWrapper(tableWrapper: ElementRef) {
    this.renderer.setStyle(tableWrapper, 'max-width', this.maxWidth);
    this.renderer.setStyle(tableWrapper, 'overflow-x', 'auto');
    this.renderer.setStyle(tableWrapper, 'display', 'block');
  }

  wrapTableWithHorizontalAndVerticalScrollingWrapper(tableWrapper: ElementRef) {
    this.renderer.setStyle(tableWrapper, 'max-height', this.maxHeight);
    this.renderer.setStyle(tableWrapper, 'max-width', this.maxWidth);
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
