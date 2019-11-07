import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mdb-card-text',
  templateUrl: './mdb-card-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbCardTextComponent {
  @Input() class: string;
}
