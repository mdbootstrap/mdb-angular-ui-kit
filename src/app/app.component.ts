import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mdb-angular-ui-kit-free';

  successAlert = false;

  copyToClipboard(value: string): void {
    const tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    this.successAlert = true;

    setTimeout(() => {
      this.successAlert = false;
    }, 900);
  }
}
