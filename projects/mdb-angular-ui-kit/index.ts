import { NgModule } from '@angular/core';

// MDB Angular UI Kit Free Modules

import { MdbCollapseModule } from './collapse/collapse.module';
import { MdbCheckboxModule } from './checkbox/checkbox.module';
import { MdbRadioModule } from './radio/radio.module';
import { MdbTooltipModule } from './tooltip/tooltip.module';
import { MdbPopoverModule } from './popover/popover.module';
import { MdbFormsModule } from './forms/forms.module';

export { MdbCollapseDirective, MdbCollapseModule } from './collapse/index';
export {
  MdbCheckboxDirective,
  MdbCheckboxModule,
  MdbCheckboxChange,
  MDB_CHECKBOX_VALUE_ACCESSOR,
} from './checkbox/index';
export {
  MdbRadioDirective,
  MdbRadioGroupDirective,
  MdbRadioModule,
  MDB_RADIO_GROUP_VALUE_ACCESSOR,
} from './radio/index';
export { MdbTooltipDirective, MdbTooltipModule, MdbTooltipPosition } from './tooltip/index';
export { MdbPopoverDirective, MdbPopoverModule, MdbPopoverPosition } from './popover/index';
export {
  MdbFormControlComponent,
  MdbInputDirective,
  MdbLabelDirective,
  MdbFormsModule,
} from './forms/index';

const MDB_MODULES = [
  MdbCollapseModule,
  MdbCheckboxModule,
  MdbRadioModule,
  MdbTooltipModule,
  MdbPopoverModule,
  MdbFormsModule,
];

@NgModule({
  declarations: [],
  imports: [MDB_MODULES],
  exports: [MDB_MODULES],
})
export class MdbModule {}
