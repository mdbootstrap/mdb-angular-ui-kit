import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedMainComponent } from './advanced-main.component';

describe('AdvancedMainComponent', () => {
  let component: AdvancedMainComponent;
  let fixture: ComponentFixture<AdvancedMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvancedMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
