import {
  Input,
  HostBinding,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  Component,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

let defaultIdNumber = 0;

@Component({
  selector: 'mdb-error',
  template: '<ng-content></ng-content>',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbErrorDirective implements OnInit, OnDestroy {
  @Input() id = `mdb-error-${defaultIdNumber++}`;

  @HostBinding('class.error-message') errorMsg = true;
  @HostBinding('attr.id') messageId = this.id;

  readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(private _elementRef: ElementRef, private renderer: Renderer2) {}

  private _getClosestEl(el: any, selector: string): HTMLElement | null {
    for (; el && el !== document; el = el.parentNode) {
      if (el.matches && el.matches(selector)) {
        return el;
      }
    }
    return null;
  }

  ngOnInit(): void {
    const textarea = this._getClosestEl(this._elementRef.nativeElement, 'textarea');

    if (textarea) {
      let height = textarea.offsetHeight + 4 + 'px';
      this.renderer.setStyle(this._elementRef.nativeElement, 'top', height);

      fromEvent(textarea, 'keyup')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          height = textarea.offsetHeight + 4 + 'px';
          this.renderer.setStyle(this._elementRef.nativeElement, 'top', height);
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
