import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mdb-breadcrumb',
  templateUrl: './mdb-breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbBreadcrumbComponent {
  @Input() customClass: string;
  @Input() textTransform: string;
}
