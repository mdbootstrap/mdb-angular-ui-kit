import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbCollapseDirective } from '.';
import { MdbCollapseModule } from './collapse.module';

const template = `
  <button id="button" (click)="collapse.toggle()">Button</button>
  <div mdbCollapse #collapse="mdbCollapse" class="collapse" [collapsed]="collapsed">
    Collapse directive content
  </div>
`;

@Component({
  selector: 'mdb-collapse-test',
  template,
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve Angular 21 behavior.
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestCollapseComponent {
  @ViewChild('collapse') collapse: MdbCollapseDirective;

  collapsed = true;
}

describe('MDB Collapse', () => {
  const ANIMATION_TIME = 355;
  let fixture: ComponentFixture<TestCollapseComponent>;
  let element: any;
  let component: any;
  let collapse: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestCollapseComponent],
      imports: [MdbCollapseModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestCollapseComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    collapse = fixture.nativeElement.querySelector('.collapse');
  });

  it('should have content collapsed by default', () => {
    expect(collapse.classList.contains('show')).toBe(false);
  });

  it('should be expanded if collapsed input is set to false', async () => {
    component.collapsed = false;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(collapse.classList).toContain('show');
  });

  it('should allow toggling component by clicking on another element', async () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(collapse.classList).not.toContain('show');

    button.click();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(collapse.classList).toContain('show');

    button.click();
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(collapse.classList).not.toContain('show');
  });

  it('should emit events on collapse and expand', async () => {
    const button = fixture.nativeElement.querySelector('button');
    const showSpy = vi.spyOn(component.collapse.collapseShow, 'emit');
    const shownSpy = vi.spyOn(component.collapse.collapseShown, 'emit');
    const hideSpy = vi.spyOn(component.collapse.collapseHide, 'emit');
    const hiddenSpy = vi.spyOn(component.collapse.collapseHidden, 'emit');

    button.click();
    fixture.detectChanges();

    expect(showSpy).toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(shownSpy).toHaveBeenCalled();

    button.click();
    fixture.detectChanges();

    expect(hideSpy).toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, ANIMATION_TIME));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(hiddenSpy).toHaveBeenCalled();
  });
});
