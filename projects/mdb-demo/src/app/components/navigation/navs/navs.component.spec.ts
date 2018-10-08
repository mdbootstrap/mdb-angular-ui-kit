import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavsComponent } from './navs.component';

describe('NavsComponent', () => {
  let component: NavsComponent;
  let fixture: ComponentFixture<NavsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
