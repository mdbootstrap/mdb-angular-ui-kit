import { Component, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss']
})
export class InputsComponent {
  @ViewChild('input') input: ElementRef;
  @ViewChild('rangeCloud') rangeCloud: ElementRef;
  range: any = 50;
  visibility: any;
  text: string;
  emailFormEx: FormControl;
  passwordFormEx: FormControl;
  noValidation: FormControl;
  noSuccessValidation: FormControl;
  noErrorValidation: FormControl;
  customMessages: FormControl;
  errorMessage = 'Custom error message';
  formData: FormData;
  

  constructor(private renderer: Renderer2) {
    this.emailFormEx = new FormControl('', Validators.email);
    this.passwordFormEx = new FormControl('', Validators.required);
    this.noValidation = new FormControl('', Validators.required);
    this.noSuccessValidation = new FormControl('', Validators.required);
    this.noErrorValidation = new FormControl('', Validators.required);
    this.customMessages = new FormControl('', Validators.required);
    
  }

  coverage() {
    if (typeof this.range === "string" && this.range.length !== 0) {

      return this.range;
    }
    const maxValue = this.input.nativeElement.getAttribute('max');
    const cloudRange = (this.range / maxValue) * 100;
    this.renderer.setStyle(this.rangeCloud.nativeElement, 'left', cloudRange + '%')
  }

}
