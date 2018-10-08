import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedMainComponent } from './extended-main.component';

describe('ExtendedMainComponent', () => {
  let component: ExtendedMainComponent;
  let fixture: ComponentFixture<ExtendedMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
