import { Directive, Input, HostBinding, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';

let defaultIdNumber = 0;

@Directive({
  selector: 'mdb-success'
})
export class MdbSuccessDirective implements OnInit, OnDestroy {
  @Input() id = `mdb-success-${defaultIdNumber++}`;

  @HostBinding('class.success-message') successMsg = true;
  @HostBinding('attr.id') messageId = this.id;

  textareaListenFunction: Function;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private _getClosestEl(el: any, selector: string) {
    for (; el && el !== document; el = el.previousElementSibling) {
      if (el.matches(selector)) {
        return el;
      }
    }
    return null;
  }

  ngOnInit() {
    const textarea = this._getClosestEl(this.el.nativeElement, '.md-textarea');

    if (textarea) {
      let height = textarea.offsetHeight + 4 + 'px';
      this.renderer.setStyle(this.el.nativeElement, 'top', height);

      this.textareaListenFunction = this.renderer.listen(textarea, 'keyup', () => {
        height = textarea.offsetHeight + 4 + 'px';
        this.renderer.setStyle(this.el.nativeElement, 'top', height);
      });
    }
  }

  ngOnDestroy() {
    if (this.textareaListenFunction) {
      this.textareaListenFunction();
    }
  }
}
