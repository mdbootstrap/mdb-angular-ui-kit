import { Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mdb-breadcrumb-item',
  templateUrl: './mdb-breadcrumb-item.component.html',
  styleUrls: ['./_breadcrumbs.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MdbBreadcrumbItemComponent implements OnInit {
  @Input() fontWeight: string;

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, 'breadcrumb-item');
  }
}
