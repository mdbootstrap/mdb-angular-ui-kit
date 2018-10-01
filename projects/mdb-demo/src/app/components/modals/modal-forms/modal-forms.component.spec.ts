import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormsComponent } from './modal-forms.component';

describe('ModalFormsComponent', () => {
  let component: ModalFormsComponent;
  let fixture: ComponentFixture<ModalFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
