import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataVisualizeComponent } from './data-visualize.component';

describe('DataVisualizeComponent', () => {
  let component: DataVisualizeComponent;
  let fixture: ComponentFixture<DataVisualizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataVisualizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataVisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
