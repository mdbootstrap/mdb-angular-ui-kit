import { Directive, Input, HostBinding } from '@angular/core';

let defaultIdNumber = 0;

@Directive({
  selector: 'mdb-error'
})
export class MdbErrorDirective {
  @Input() id = `mdb-error-${defaultIdNumber++}`;

  @HostBinding('class.error-message') errorMsg = true;
  @HostBinding('attr.id') messageId = this.id;
}
