import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesMainComponent } from './tables-main.component';

describe('TablesMainComponent', () => {
  let component: TablesMainComponent;
  let fixture: ComponentFixture<TablesMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
