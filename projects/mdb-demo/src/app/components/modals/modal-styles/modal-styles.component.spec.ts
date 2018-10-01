import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStylesComponent } from './modal-styles.component';

describe('ModalStylesComponent', () => {
  let component: ModalStylesComponent;
  let fixture: ComponentFixture<ModalStylesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalStylesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
