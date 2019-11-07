import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'mdb-card-footer',
  templateUrl: './mdb-card-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbCardFooterComponent implements OnInit {
  constructor(private _el: ElementRef, private _r: Renderer2) {}

  ngOnInit() {
    this._r.addClass(this._el.nativeElement, 'card-footer');
  }
}
