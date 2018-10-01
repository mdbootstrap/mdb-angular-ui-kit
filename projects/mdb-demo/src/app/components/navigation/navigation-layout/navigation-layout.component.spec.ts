import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationLayoutComponent } from './navigation-layout.component';

describe('NavigationLayoutComponent', () => {
  let component: NavigationLayoutComponent;
  let fixture: ComponentFixture<NavigationLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
