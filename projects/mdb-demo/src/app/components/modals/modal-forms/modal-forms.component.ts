import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-forms',
  templateUrl: './modal-forms.component.html',
  styleUrls: ['./modal-forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalFormsComponent {

  loginFormModalEmail = new FormControl('', Validators.email);
  loginFormModalPassword = new FormControl('', Validators.required);

  signupFormModalName = new FormControl('', Validators.required);
  signupFormModalEmail = new FormControl('', Validators.email);
  signupFormModalPassword = new FormControl('', Validators.required);

  subscriptionFormModalName = new FormControl('', Validators.required);
  subscriptionFormModalEmail = new FormControl('', Validators.email);

  contactFormModalName = new FormControl('', Validators.required);
  contactFormModalEmail = new FormControl('', Validators.email);
  contactFormModalSubject = new FormControl('', Validators.required);
  contactFormModalMessage = new FormControl('', Validators.required);

  modalFormLoginEmail = new FormControl('', Validators.email);
  modalFormLoginPassword = new FormControl('', Validators.required);
  modalFormRegisterEmail = new FormControl('', Validators.email);
  modalFormRegisterPassword = new FormControl('', Validators.required);
  modalFormRegisterRepeatPassword = new FormControl('', Validators.required);

  modalFormAvatarPassword = new FormControl('', Validators.required);

  modalFormSubscriptionName = new FormControl('', Validators.required);
  modalFormSubscriptionEmail = new FormControl('', Validators.email);

  modalFormElegantEmail = new FormControl('', Validators.email);
  modalFormElegantPassword = new FormControl('', Validators.required);

  modalFormDarkEmail = new FormControl('', Validators.email);
  modalFormDarkPassword = new FormControl('', Validators.required);

}
