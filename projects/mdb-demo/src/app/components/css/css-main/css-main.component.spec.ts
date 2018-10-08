import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssMainComponent } from './css-main.component';

describe('CssMainComponent', () => {
  let component: CssMainComponent;
  let fixture: ComponentFixture<CssMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
