import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubmitComponent } from './data-submit.component';

describe('DataSubmitComponent', () => {
  let component: DataSubmitComponent;
  let fixture: ComponentFixture<DataSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
