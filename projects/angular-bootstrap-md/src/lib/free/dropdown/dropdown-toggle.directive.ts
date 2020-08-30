import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { BsDropdownState } from './dropdown.state';

@Directive({
  selector: '[mdbDropdownToggle],[dropdownToggle]',
  exportAs: 'bs-dropdown-toggle',
})
export class BsDropdownToggleDirective implements OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _documentClickListener: Function;
  private _escKeyUpListener: Function;

  @HostBinding('attr.aria-haspopup') ariaHaspopup = true;
  @HostBinding('attr.disabled') isDisabled: boolean | any = null;
  @HostBinding('attr.aria-expanded') isOpen: boolean;

  @HostListener('click')
  onClick(): void {
    if (this.isDisabled) {
      return;
    }
    this._state.toggleClick.emit();
  }

  constructor(
    private _state: BsDropdownState,
    private _element: ElementRef,
    private _renderer: Renderer2,
    private _cdRef: ChangeDetectorRef
  ) {
    // sync is open value with state
    this._state.isOpenChange.subscribe((value: boolean) => {
      this.isOpen = value;

      if (value) {
        this._documentClickListener = this._renderer.listen('document', 'click', (event: any) => {
          if (
            this._state.autoClose &&
            event.button !== 2 &&
            !this._element.nativeElement.contains(event.target)
          ) {
            this._state.toggleClick.emit(false);
            this._cdRef.detectChanges();
          }
        });

        this._escKeyUpListener = this._renderer.listen(
          this._element.nativeElement,
          'keyup.esc',
          () => {
            if (this._state.autoClose) {
              this._state.toggleClick.emit(false);
              this._cdRef.detectChanges();
            }
          }
        );
      } else {
        this._documentClickListener();
        this._escKeyUpListener();
      }
    });
    // populate disabled state
    this._subscriptions.push(
      this._state.isDisabledChange.subscribe(
        (value: boolean | any) => (this.isDisabled = value || null)
      )
    );
  }

  ngOnDestroy(): void {
    if (this._documentClickListener) {
      this._documentClickListener();
    }

    if (this._escKeyUpListener) {
      this._escKeyUpListener();
    }

    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
  }
}
