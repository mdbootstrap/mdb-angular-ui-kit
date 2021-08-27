import { Observable } from 'rxjs';
import { Directive } from '@angular/core';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class MdbAbstractFormControl<T> {
  readonly stateChanges: Observable<void>;
  readonly input: HTMLInputElement;
  readonly labelActive: boolean;
}
