import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsMainComponent } from './forms-main.component';

describe('FormsMainComponent', () => {
  let component: FormsMainComponent;
  let fixture: ComponentFixture<FormsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
