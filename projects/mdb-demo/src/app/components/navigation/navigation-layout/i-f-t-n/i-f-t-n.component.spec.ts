import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IFTNComponent } from './i-f-t-n.component';

describe('IFTNComponent', () => {
  let component: IFTNComponent;
  let fixture: ComponentFixture<IFTNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IFTNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IFTNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
