import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
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

  it('should be expanded if collapsed input is set to false', fakeAsync(() => {
    component.collapsed = false;
    fixture.detectChanges();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(collapse.classList).toContain('show');
  }));

  it('should allow toggling component by clicking on another element', fakeAsync(() => {
    const button = fixture.nativeElement.querySelector('button');

    expect(collapse.classList).not.toContain('show');

    button.click();
    fixture.detectChanges();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(collapse.classList).toContain('show');

    button.click();
    fixture.detectChanges();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(collapse.classList).not.toContain('show');
  }));

  it('should emit events on collapse and expand', fakeAsync(() => {
    const button = fixture.nativeElement.querySelector('button');
    const showSpy = jest.spyOn(component.collapse.collapseShow, 'emit');
    const shownSpy = jest.spyOn(component.collapse.collapseShown, 'emit');
    const hideSpy = jest.spyOn(component.collapse.collapseHide, 'emit');
    const hiddenSpy = jest.spyOn(component.collapse.collapseHidden, 'emit');

    button.click();
    fixture.detectChanges();

    expect(showSpy).toHaveBeenCalled();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(shownSpy).toHaveBeenCalled();

    button.click();
    fixture.detectChanges();

    expect(hideSpy).toHaveBeenCalled();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(hiddenSpy).toHaveBeenCalled();
  }));
});
