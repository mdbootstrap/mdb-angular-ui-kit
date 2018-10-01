import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsMainComponent } from './modals-main.component';

describe('ModalsMainComponent', () => {
  let component: ModalsMainComponent;
  let fixture: ComponentFixture<ModalsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
