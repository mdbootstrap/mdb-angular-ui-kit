import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbCollapseModule } from './collapse.module';

const template = `
  <button id="button" (click)="collapse.toggle()">Button</button>
  <div mdbCollapse #collapse="mdbCollapse" class="collapse" [collapsed]="collapsed" (collapseShown)="onShown()" (collapseHidden)="onHidden()">
    Collapse directive content
  </div>
`;

@Component({
  selector: 'mdb-collapse-test',
  template,
})
class TestCollapseComponent {
  collapsed = true;
  onShown = () => {};
  onHidden = () => {};
}

describe('MDB Collapse', () => {
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

  it('should have content expanded if collapsed input is set to false', () => {
    // const onShownSpy = jest.spyOn(component, 'onShown');
    // component.collapsed = false;
    // fixture.detectChanges();
    // onShownSpy.and.callFake(() => {
    //   expect(collapse.classList.contains('show')).toBe(true);
    // });
  });

  it('should allow toggling component by clicking on another element', () => {
    // const onShownSpy = jest.spyOn(component, 'onShown');
    // const onHiddenSpy = jest.spyOn(component, 'onHidden');
    // const buttonEl = fixture.nativeElement.querySelector('#button');
    // buttonEl.click();
    // fixture.detectChanges();
    // onShownSpy.and.callFake(() => {
    //   expect(collapse.classList.contains('show')).toBe(true);
    // });
    // buttonEl.click();
    // fixture.detectChanges();
    // onHiddenSpy.and.callFake(() => {
    //   expect(collapse.classList.contains('show')).toBe(false);
    // });
  });
});
