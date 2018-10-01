import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationApiComponent } from './pagination-api.component';

describe('PaginationApiComponent', () => {
  let component: PaginationApiComponent;
  let fixture: ComponentFixture<PaginationApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
