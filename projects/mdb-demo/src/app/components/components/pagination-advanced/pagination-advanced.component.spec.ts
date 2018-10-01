import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationAdvancedComponent } from './pagination-advanced.component';

describe('PaginationAdvancedComponent', () => {
  let component: PaginationAdvancedComponent;
  let fixture: ComponentFixture<PaginationAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
