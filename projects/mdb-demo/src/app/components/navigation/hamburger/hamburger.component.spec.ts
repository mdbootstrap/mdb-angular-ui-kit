import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerComponent } from './hamburger.component';

describe('HamburgerComponent', () => {
  let component: HamburgerComponent;
  let fixture: ComponentFixture<HamburgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HamburgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HamburgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
