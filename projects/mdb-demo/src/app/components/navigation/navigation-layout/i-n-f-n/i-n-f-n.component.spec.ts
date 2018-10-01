import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { INFNComponent } from './i-n-f-n.component';

describe('INFNComponent', () => {
  let component: INFNComponent;
  let fixture: ComponentFixture<INFNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ INFNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(INFNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
