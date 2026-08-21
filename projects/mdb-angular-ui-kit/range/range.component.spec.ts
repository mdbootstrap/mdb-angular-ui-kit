import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbRangeModule } from './range.module';
import { MdbRangeComponent } from './range.component';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

const template = `
<mdb-range [formControl]="rangeControl"></mdb-range>
`;

@Component({
  selector: 'mdb-range-test',
  template,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestRangeComponent implements OnInit {
  @ViewChild(MdbRangeComponent) _range: MdbRangeComponent;

  rangeControl = new UntypedFormControl(50);
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

  it('should show thumb on mousedown and hide on mauseup', async () => {
    expect(thumb.nativeElement.classList.contains('thumb-active')).toBe(false);

    input.nativeElement.dispatchEvent(new MouseEvent('mousedown'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(thumb.nativeElement.classList.contains('thumb-active')).toBe(true);

    input.nativeElement.dispatchEvent(new MouseEvent('mouseup'));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(thumb.nativeElement.classList.contains('thumb-active')).toBe(false);
  });

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

  it('should update value after set new FormControl', async () => {
    component.rangeControl = new UntypedFormControl(60);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(valueThumb.nativeElement.textContent).toBe('60');
    expect(input.nativeElement.value).toBe('60');
  });

  it('should update thumb position', async () => {
    const initialThumbStyle = { ...component._range.thumbStyle };

    component.rangeControl = new UntypedFormControl(70);
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
    // Wait for the setTimeout(0) in writeValue to execute
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    const newThumbStyle = { ...component._range.thumbStyle };

    expect(initialThumbStyle.left).not.toBe(newThumbStyle.left);
  });
});
