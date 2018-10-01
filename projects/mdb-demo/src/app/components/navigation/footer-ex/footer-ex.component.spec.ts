import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterExComponent } from './footer-ex.component';

describe('FooterExComponent', () => {
  let component: FooterExComponent;
  let fixture: ComponentFixture<FooterExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
