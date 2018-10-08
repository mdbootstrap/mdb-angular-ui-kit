import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { INFTNComponent } from './i-n-f-t-n.component';

describe('INFTNComponent', () => {
  let component: INFTNComponent;
  let fixture: ComponentFixture<INFTNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ INFTNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(INFTNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
