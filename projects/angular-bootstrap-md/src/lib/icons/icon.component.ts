import {Component, Input, ElementRef, OnInit, Renderer2} from '@angular/core';


@Component({
  selector: 'mdb-icon',
  templateUrl: './icon.component.html'
})
export class MdbIconComponent implements OnInit {

  @Input() icon: string;
  @Input() size: string;
  @Input() class: string;

  fab = false;
  far = false;
  fal = false;
  fas = true;

  sizeClass = '';

  constructor(private _el: ElementRef, private _renderer: Renderer2) {
  }

  ngOnInit() {
    if (this.size) {
      this.sizeClass = `fa-${this.size}`;
    }

    if (this._el.nativeElement.parentElement.classList.contains('md-form')) {
      this._renderer.addClass(this._el.nativeElement, 'prefix');
    }

    const classList = this._el.nativeElement.classList;
    this.fab = classList.contains('fab');
    this.far = classList.contains('far');
    this.fas = classList.contains('fas');
    this.fal = classList.contains('fal');

  }

}
