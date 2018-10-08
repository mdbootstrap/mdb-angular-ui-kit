import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputValidationComponent } from './input-validation.component';

describe('InputValidationComponent', () => {
  let component: InputValidationComponent;
  let fixture: ComponentFixture<InputValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
