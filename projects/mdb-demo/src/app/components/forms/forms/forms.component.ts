import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  subscriptionForm: FormGroup;
  contactForm: FormGroup;
  cardForm: FormGroup;
  modalForm: FormGroup;
  elegantForm: FormGroup;
  gradientForm: FormGroup;
  lightForm: FormGroup;
  darkForm: FormGroup;
  simpleForm: FormGroup;

  constructor(public fb: FormBuilder) {
    this.loginForm = fb.group({
      defaultFormEmail: ['', Validators.required],
      defaultFormPass: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.registerForm = fb.group({
      orangeFormName: ['', Validators.required],
      orangeFormEmail: ['', [Validators.required, Validators.email]],
      orangeFormPass: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.subscriptionForm = fb.group({
      subscriptionFormName: ['', Validators.required],
      subscriptionFormEmail: ['', [Validators.required, Validators.email]]
    });
    this.contactForm = fb.group({
      contactFormName: ['', Validators.required],
      contactFormEmail: ['', [Validators.required, Validators.email]],
      contactFormSubject: ['', Validators.required],
      contactFormMessage: ['', Validators.required]
    });
    this.cardForm = fb.group({
      materialFormCardNameEx: ['', Validators.required],
      materialFormCardEmailEx: ['', [Validators.email, Validators.required]],
      materialFormCardConfirmEx: ['', Validators.required],
      materialFormCardPasswordEx: ['', Validators.required]
    });
    this.modalForm = fb.group({
      modalFormNameEx: ['', Validators.required],
      modalFormEmailEx: ['', [Validators.email, Validators.required]],
      modalFormSubjectEx: ['', Validators.required],
      modalFormTextEx: ['', Validators.required]
    });
    this.elegantForm = fb.group({
      elegantFormEmailEx: ['', [Validators.required, Validators.email]],
      elegantFormPasswordEx: ['', Validators.required],
    });
    this.gradientForm = fb.group({
      gradientFormEmailEx: ['', [Validators.required, Validators.email]],
      gradientFormPasswordEx: ['', Validators.required],
    });
    this.lightForm = fb.group({
      lightFormEmailEx: ['', [Validators.required, Validators.email]],
      lightFormPasswordEx: ['', Validators.required],
    });
    this.darkForm = fb.group({
      darkFormEmailEx: ['', [Validators.required, Validators.email]],
      darkFormPasswordEx: ['', Validators.required],
    });
    this.simpleForm = fb.group({
      simpleFormEmailEx: ['', [Validators.required, Validators.email]],
      simpleFormPasswordEx: ['', Validators.required],
    });
  }

}
