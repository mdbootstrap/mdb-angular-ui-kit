import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdvancedComponent } from './modal-advanced.component';

describe('ModalAdvancedComponent', () => {
  let component: ModalAdvancedComponent;
  let fixture: ComponentFixture<ModalAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
