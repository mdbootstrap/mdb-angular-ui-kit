import { CdkPortalOutlet } from '@angular/cdk/portal';

import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdbTabComponent } from './tab.component';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbTabPortalOutlet]',
  standalone: false,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MdbTabPortalOutlet extends CdkPortalOutlet implements OnInit, OnDestroy {
  readonly _destroy$: Subject<void> = new Subject<void>();

  @Input() tab: MdbTabComponent;

  ngOnInit(): void {
    super.ngOnInit();

    if ((this.tab.shouldAttach || this.tab.active) && !this.hasAttached()) {
      this.attach(this.tab.content);
    } else {
      this.tab.activeStateChange$.pipe(takeUntil(this._destroy$)).subscribe((isActive) => {
        if (isActive && !this.hasAttached()) {
          this.attach(this.tab.content);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    super.ngOnDestroy();
  }
}
