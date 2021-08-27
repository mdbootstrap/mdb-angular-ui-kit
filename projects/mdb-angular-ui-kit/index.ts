import { NgModule } from '@angular/core';

// MDB Angular UI Kit Free Modules

import { MdbCollapseModule } from './collapse/collapse.module';

export { MdbCollapseDirective, MdbCollapseModule } from './collapse/index';

const MDB_MODULES = [MdbCollapseModule];

@NgModule({
  declarations: [],
  imports: [MDB_MODULES],
  exports: [MDB_MODULES],
})
export class MdbModule {}
