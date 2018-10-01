import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselFullpageExampleComponent } from './carousel-fullpage-example.component';

describe('CarouselFullpageExampleComponent', () => {
  let component: CarouselFullpageExampleComponent;
  let fixture: ComponentFixture<CarouselFullpageExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselFullpageExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselFullpageExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
