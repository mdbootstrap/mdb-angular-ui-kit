import { Directive, Input, HostBinding } from '@angular/core';

let defaultIdNumber = 0;

@Directive({
  selector: 'mdb-success'
})
export class MdbSuccessDirective {
  @Input() id = `mdb-success-${defaultIdNumber++}`;

  @HostBinding('class.success-message') successMsg = true;
  @HostBinding('attr.id') messageId = this.id;
}
