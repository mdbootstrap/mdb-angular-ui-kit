import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RNFNComponent } from './r-n-f-n.component';

describe('RNFNComponent', () => {
  let component: RNFNComponent;
  let fixture: ComponentFixture<RNFNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RNFNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RNFNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
