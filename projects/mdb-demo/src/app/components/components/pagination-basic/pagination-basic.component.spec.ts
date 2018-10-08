import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationBasicComponent } from './pagination-basic.component';

describe('PaginationBasicComponent', () => {
  let component: PaginationBasicComponent;
  let fixture: ComponentFixture<PaginationBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
