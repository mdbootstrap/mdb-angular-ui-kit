import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DounghnutComponent } from './dounghnut.component';

describe('DounghnutComponent', () => {
  let component: DounghnutComponent;
  let fixture: ComponentFixture<DounghnutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DounghnutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DounghnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
