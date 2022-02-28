import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbRangeModule } from './range.module';
import { MdbRangeComponent } from './range.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const template = `
<mdb-range [formControl]="rangeControl"></mdb-range>
`;

@Component({
  selector: 'mdb-range-test',
  template,
})
class TestRangeComponent implements OnInit {
  @ViewChild(MdbRangeComponent) _range: MdbRangeComponent;

  rangeControl = new FormControl(50);
  ngOnInit(): void {
    this.rangeControl.valueChanges.subscribe((val) => console.log(val));
  }
}

describe('MDB Range', () => {
  let fixture: ComponentFixture<TestRangeComponent>;
  let component: any;
  let mdbRange: any;
  let thumb: any;
  let valueThumb: any;
  let input: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestRangeComponent],
      imports: [MdbRangeModule, ReactiveFormsModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestRangeComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    mdbRange = fixture.debugElement.query(By.css('mdb-range'));
    thumb = fixture.debugElement.query(By.css('.thumb'));
    valueThumb = fixture.debugElement.query(By.css('.thumb-value'));
    input = fixture.debugElement.query(By.css('input'));
  });

  it('should show thumb on mousedown and hide on mauseup', fakeAsync(() => {
    expect(thumb.nativeElement.classList.contains('thumb-active')).toBe(false);

    input.nativeElement.dispatchEvent(new MouseEvent('mousedown'));

    fixture.detectChanges();
    flush();

    expect(thumb.nativeElement.classList.contains('thumb-active')).toBe(true);

    input.nativeElement.dispatchEvent(new MouseEvent('mouseup'));

    fixture.detectChanges();
    flush();

    expect(thumb.nativeElement.classList.contains('thumb-active')).toBe(false);
  }));

  it('should show input value', () => {
    fixture.detectChanges();

    expect(document.querySelector('.thumb')).not.toBe(null);
    expect(valueThumb.nativeElement.textContent).toBe(input.nativeElement.value);
  });

  it('should update thumb value after input', () => {
    input.nativeElement.value = 24;
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(valueThumb.nativeElement.textContent).toBe('24');
  });

  it('should update value after set new FormControl', () => {
    component.rangeControl = new FormControl(60);
    fixture.detectChanges();

    expect(valueThumb.nativeElement.textContent).toBe('60');
    expect(input.nativeElement.value).toBe('60');
  });

  it('should update thumb position', fakeAsync(() => {
    const initialThumbStyle = { ...component._range.thumbStyle };

    component.rangeControl = new FormControl(70);

    fixture.detectChanges();
    flush();
    const newThumbStyle = { ...component._range.thumbStyle };

    expect(initialThumbStyle.left).not.toBe(newThumbStyle.left);
  }));
});
