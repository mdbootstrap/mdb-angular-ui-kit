import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbCarouselComponent } from './carousel.component';
import { MdbCarouselModule } from './carousel.module';

const carouselTemplate = `
<mdb-carousel
    [interval]="0"
    [controls]="controls"
    [indicators]="indicators"
    [wrap]="wrap"
    [dark]="dark"
    [animation]="animation"
>
    <mdb-carousel-item>
    <img
        src="https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg"
        class="d-block w-100"
        alt="..."
    />
    </mdb-carousel-item>

    <mdb-carousel-item>
    <img
        src="https://mdbootstrap.com/img/Photos/Slides/img%20(22).jpg"
        class="d-block w-100"
        alt="..."
    />
    </mdb-carousel-item>

    <mdb-carousel-item>
    <img
        src="https://mdbootstrap.com/img/Photos/Slides/img%20(23).jpg"
        class="d-block w-100"
        alt="..."
    />
    </mdb-carousel-item>
</mdb-carousel>
`;

@Component({
  template: carouselTemplate,
})
export class CarouselTestComponent {
  @ViewChild(MdbCarouselComponent, { static: true }) carousel: MdbCarouselComponent;
  controls = false;
  indicators = false;
  wrap = true;
  dark = false;
  animation = 'slide';
}

describe('MDB Carousel', () => {
  let fixture: ComponentFixture<CarouselTestComponent>;
  let component: CarouselTestComponent;
  let carousel: MdbCarouselComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselTestComponent],
      imports: [MdbCarouselModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(CarouselTestComponent);
    component = fixture.componentInstance;
    carousel = component.carousel;

    fixture.detectChanges();
  });

  it('should set first slide as active by default', fakeAsync(() => {
    flush();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.carousel-item');
    expect(items[0].classList.contains('active')).toBe(true);
  }));

  it('should show indicators if indicators input is set to true', () => {
    component.indicators = true;
    fixture.detectChanges();
    const indicators = fixture.nativeElement.querySelectorAll('.carousel-indicators');
    expect(indicators).toBeDefined();
  });

  it('should show controls if controls input is set to true', () => {
    component.controls = true;
    fixture.detectChanges();
    const prevArrow = fixture.nativeElement.querySelector('.carousel-control-prev');
    const nextArrow = fixture.nativeElement.querySelector('.carousel-control-next');
    expect(prevArrow).toBeDefined();
    expect(nextArrow).toBeDefined();
  });

  it('should add carousel-fade class if animation type is set to fade', () => {
    component.animation = 'fade';
    fixture.detectChanges();
    const carouselEl = fixture.nativeElement.querySelector('.carousel');
    expect(carouselEl.classList.contains('carousel-fade')).toBe(true);
  });

  it('should add carousel-dark class if dark input is set to true', () => {
    component.dark = true;
    fixture.detectChanges();
    const carouselEl = fixture.nativeElement.querySelector('.carousel');
    expect(carouselEl.classList.contains('carousel-dark')).toBe(true);
  });

  it('should set corresponding indicator as active', fakeAsync(() => {
    component.indicators = true;
    fixture.detectChanges();
    const indicators = fixture.nativeElement.querySelectorAll('.carousel-indicators > button');
    expect(indicators[0].classList.contains('active')).toBe(true);
  }));

  it('should change active slide on indicator click', fakeAsync(() => {
    component.indicators = true;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.carousel-item');
    const indicators = fixture.nativeElement.querySelectorAll('.carousel-indicators > button');
    expect(indicators[0].classList.contains('active')).toBe(true);
    expect(items[0].classList.contains('active')).toBe(true);

    indicators[1].click();
    tick(1000);
    fixture.detectChanges();

    expect(indicators[1].classList.contains('active')).toBe(true);
    expect(items[1].classList.contains('active')).toBe(true);
  }));

  it('should change slide on previous arrow click', fakeAsync(() => {
    component.controls = true;
    component.wrap = true;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.carousel-item');
    const prevArrow = fixture.nativeElement.querySelector('.carousel-control-prev');
    expect(items[0].classList.contains('active')).toBe(true);

    prevArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[2].classList.contains('active')).toBe(true);

    prevArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[1].classList.contains('active')).toBe(true);
  }));

  it('should change slide on next arrow click', fakeAsync(() => {
    component.controls = true;
    component.wrap = true;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.carousel-item');
    const nextArrow = fixture.nativeElement.querySelector('.carousel-control-next');
    expect(items[0].classList.contains('active')).toBe(true);

    nextArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[1].classList.contains('active')).toBe(true);

    nextArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[2].classList.contains('active')).toBe(true);
  }));

  it('should not go to previous slide if first slide is active and wrap option is disabled', fakeAsync(() => {
    component.controls = true;
    component.wrap = false;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.carousel-item');
    const prevArrow = fixture.nativeElement.querySelector('.carousel-control-prev');
    expect(items[0].classList.contains('active')).toBe(true);

    prevArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[0].classList.contains('active')).toBe(true);
    expect(items[2].classList.contains('active')).toBe(false);
  }));

  it('should not go to next slide if last slide is active and wrap option is disabled', fakeAsync(() => {
    component.controls = true;
    component.wrap = false;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.carousel-item');
    const nextArrow = fixture.nativeElement.querySelector('.carousel-control-next');
    expect(items[0].classList.contains('active')).toBe(true);

    nextArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[1].classList.contains('active')).toBe(true);

    nextArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[2].classList.contains('active')).toBe(true);

    nextArrow.click();
    tick(1000);
    fixture.detectChanges();

    expect(items[2].classList.contains('active')).toBe(true);
    expect(items[0].classList.contains('active')).toBe(false);
  }));
});
