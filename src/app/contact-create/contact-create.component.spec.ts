import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCreateComponent } from './contact-create.component';

describe('ContactCreateComponent', () => {
  let component: ContactCreateComponent;
  let fixture: ComponentFixture<ContactCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
