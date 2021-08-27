import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { MdbModalContainerComponent } from './modal-container.component';

export class MdbModalRef<T> {
  constructor(protected _overlayRef: OverlayRef, private _container: MdbModalContainerComponent) {}

  private readonly onClose$: Subject<any> = new Subject();
  readonly onClose: Observable<any> = this.onClose$.asObservable();

  close(message?: any): void {
    this._container._close();

    setTimeout(() => {
      this._container._restoreScrollbar();
      this.onClose$.next(message);
      this.onClose$.complete();
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }, this._container.MODAL_TRANSITION);
  }
}
