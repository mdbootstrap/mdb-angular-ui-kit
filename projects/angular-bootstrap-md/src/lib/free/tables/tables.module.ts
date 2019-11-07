import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbTableDirective } from './directives/mdb-table.directive';
import { MdbTableSortDirective } from './directives/mdb-table-sort.directive';
import { MdbTableScrollDirective } from './directives/mdb-table-scroll.directive';
import { MdbTableRowDirective } from './directives/mdb-table-row.directive';
import { MdbTableService } from './services/mdb-table.service';
import { MdbTablePaginationComponent } from './components/mdb-table-pagination.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MdbTablePaginationComponent,
    MdbTableRowDirective,
    MdbTableScrollDirective,
    MdbTableSortDirective,
    MdbTableDirective,
  ],
  exports: [
    MdbTablePaginationComponent,
    MdbTableRowDirective,
    MdbTableScrollDirective,
    MdbTableSortDirective,
    MdbTableDirective,
  ],
  entryComponents: [MdbTablePaginationComponent],
  providers: [MdbTableService],
})
export class TableModule {}
