import { Directive, ElementRef, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BsDropdownState } from './dropdown.state';

@Directive({
  selector: '[mdbDropdownToggle],[dropdownToggle]',
  exportAs: 'bs-dropdown-toggle',
})
export class BsDropdownToggleDirective implements OnDestroy {
  private _subscriptions: Subscription[] = [];

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    if (
      this._state.autoClose &&
      event.button !== 2 &&
      !this._element.nativeElement.contains(event.target)
    ) {
      this._state.toggleClick.emit(false);
    }
  }

  @HostListener('keyup.esc')
  onEsc(): void {
    if (this._state.autoClose) {
      this._state.toggleClick.emit(false);
    }
  }

  constructor(private _state: BsDropdownState, private _element: ElementRef) {
    // sync is open value with state
    this._subscriptions.push(
      this._state.isOpenChange.subscribe((value: boolean) => (this.isOpen = value))
    );
    // populate disabled state
    this._subscriptions.push(
      this._state.isDisabledChange.subscribe(
        (value: boolean | any) => (this.isDisabled = value || null)
      )
    );
  }

  ngOnDestroy(): void {
    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
  }
}
