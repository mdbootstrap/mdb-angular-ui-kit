import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RFNComponent } from './r-f-n.component';

describe('RFNComponent', () => {
  let component: RFNComponent;
  let fixture: ComponentFixture<RFNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RFNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RFNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
