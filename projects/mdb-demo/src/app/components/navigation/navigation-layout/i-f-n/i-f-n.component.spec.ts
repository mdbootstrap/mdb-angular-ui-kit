import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IFNComponent } from './i-f-n.component';

describe('IFNComponent', () => {
  let component: IFNComponent;
  let fixture: ComponentFixture<IFNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IFNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IFNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
