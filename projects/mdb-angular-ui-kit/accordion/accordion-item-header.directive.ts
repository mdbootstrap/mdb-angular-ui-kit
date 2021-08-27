import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_ACCORDION_ITEM_HEADER = new InjectionToken<MdbAccordionItemHeaderDirective>(
  'MdbAccordionItemHeaderDirective'
);

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbAccordionItemHeader]',
  providers: [{ provide: MDB_ACCORDION_ITEM_HEADER, useExisting: MdbAccordionItemHeaderDirective }],
})
export class MdbAccordionItemHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
