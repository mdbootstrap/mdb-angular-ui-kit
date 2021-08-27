import { Observable } from 'rxjs';
import { Directive } from '@angular/core';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class MdbAbstractFormControl<T> {
  readonly stateChanges: Observable<void>;
  readonly labelActive: boolean;
}
