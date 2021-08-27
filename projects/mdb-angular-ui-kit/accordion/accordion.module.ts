import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionComponent } from './accordion.component';
import { MdbAccordionItemComponent } from './accordion-item.component';
import { MdbAccordionItemHeaderDirective } from './accordion-item-header.directive';
import { MdbAccordionItemBodyDirective } from './accordion-item-content.directive';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

@NgModule({
  declarations: [
    MdbAccordionComponent,
    MdbAccordionItemComponent,
    MdbAccordionItemHeaderDirective,
    MdbAccordionItemBodyDirective,
  ],
  imports: [CommonModule, MdbCollapseModule],
  exports: [
    MdbAccordionComponent,
    MdbAccordionItemComponent,
    MdbAccordionItemHeaderDirective,
    MdbAccordionItemBodyDirective,
  ],
})
export class MdbAccordionModule {}
