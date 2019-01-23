import { CommonModule } from '@angular/common';
import { MdbBreadcrumbComponent } from './mdb-breadcrumb.component';
import { MdbBreadcrumbItemComponent } from './mdb-breadcrumb-item.component';
import { NgModule } from '@angular/core';


@NgModule({
    imports: [CommonModule],
    declarations: [MdbBreadcrumbComponent, MdbBreadcrumbItemComponent],
    exports: [MdbBreadcrumbComponent, MdbBreadcrumbItemComponent]
})

export class BreadcrumbModule {

}
