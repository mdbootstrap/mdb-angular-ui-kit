import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMainComponent } from './navigation-main.component';

describe('NavigationMainComponent', () => {
  let component: NavigationMainComponent;
  let fixture: ComponentFixture<NavigationMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
