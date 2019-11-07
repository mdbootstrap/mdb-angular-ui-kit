import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mdb-card-img',
  templateUrl: './mdb-card-image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbCardImageComponent {
  @Input() src: string;
  @Input() alt: string;
}
