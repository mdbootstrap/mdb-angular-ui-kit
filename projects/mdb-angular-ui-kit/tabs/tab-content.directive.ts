import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_TAB_CONTENT = new InjectionToken<MdbTabContentDirective>('MdbTabContentDirective');

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbTabContent]',
  providers: [{ provide: MDB_TAB_CONTENT, useExisting: MdbTabContentDirective }],
})
export class MdbTabContentDirective {
  constructor(public template: TemplateRef<any>) {}
}
