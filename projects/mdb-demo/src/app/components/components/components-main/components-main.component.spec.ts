import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsMainComponent } from './components-main.component';

describe('ComponentsMainComponent', () => {
  let component: ComponentsMainComponent;
  let fixture: ComponentFixture<ComponentsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
