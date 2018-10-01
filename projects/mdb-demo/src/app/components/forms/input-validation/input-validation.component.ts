import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.scss']
})
export class InputValidationComponent {

  validatingForm: FormGroup;
  emailFormEx: FormControl;
  passwordFormEx: FormControl;
  noValidation: FormControl;
  noSuccessValidation: FormControl;
  noErrorValidation: FormControl;
  customMessages: FormControl;
  errorMessage = 'Custom error message';

  constructor(public fb: FormBuilder) {
    this.validatingForm = fb.group({
      'minlength': [null, Validators.compose([Validators.minLength(3), Validators.required])],
      'maxlength': [null, Validators.maxLength(5)],
      'min': [null, Validators.min(10)],
      'max': [null, Validators.max(10)],
      'email': [null, Validators.email],
      'pattern': [null, Validators.pattern(/A-Za-z/)],
      'required': [null, Validators.required],
    });
    this.emailFormEx = new FormControl('', Validators.email);
    this.passwordFormEx = new FormControl('', Validators.required);
    this.noValidation = new FormControl('', Validators.required);
    this.noSuccessValidation = new FormControl('', Validators.required);
    this.noErrorValidation = new FormControl('', Validators.required);
    this.customMessages = new FormControl('', Validators.required);
  }

}
