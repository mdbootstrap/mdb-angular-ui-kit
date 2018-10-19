import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdb-breadcrumb',
  templateUrl: './mdb-breadcrumb.component.html'
})
export class MdbBreadcrumbComponent {
  @Input() customClass: string;
  @Input() textTransform: string;
}
