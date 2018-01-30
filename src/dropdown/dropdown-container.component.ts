import { ChangeDetectionStrategy, Component, OnDestroy, HostBinding } from '@angular/core';
import { BsDropdownState } from './dropdown.state';

@Component({
  selector: 'mdb-dropdown-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div [class.dropup]="direction === 'up'"
  [class.dropdown]="direction === 'down'"
  [class.show]="isOpen"
  [class.open]="isOpen">
    <ng-content></ng-content>
  </div>
  `
})
export class BsDropdownContainerComponent implements OnDestroy {
  isOpen = false;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';

  get direction(): 'down' | 'up' {
    return this._state.direction;
  }

  private _subscription: any;

  constructor(private _state: BsDropdownState) {
    this._subscription = _state.isOpenChange.subscribe((value: boolean) => {
      this.isOpen = value;
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
