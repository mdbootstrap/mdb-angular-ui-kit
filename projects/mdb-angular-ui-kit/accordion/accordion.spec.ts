import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbAccordionItemComponent } from './accordion-item.component';
import { MdbAccordionModule } from './accordion.module';

const template = `
<mdb-accordion [multiple]="multiple" [flush]="flush">
    <mdb-accordion-item>
        <ng-template mdbAccordionItemHeader>Accordion Item #1</ng-template>
        <ng-template mdbAccordionItemBody>
            <strong>This is the first item's accordion body.</strong> It is hidden by default,
            until the collapse plugin adds the appropriate classes that we use to style each
            element. These classes control the overall appearance, as well as the showing and
            hiding via CSS transitions. You can modify any of this with custom CSS or overriding
            our default variables. It's also worth noting that just about any HTML can go within
            the <strong>.accordion-body</strong>, though the transition does limit overflow.
        </ng-template>
    </mdb-accordion-item>

    <mdb-accordion-item>
        <ng-template mdbAccordionItemHeader>Accordion Item #2</ng-template>
        <ng-template mdbAccordionItemBody>
            <strong>This is the second item's accordion body.</strong> It is hidden by default,
            until the collapse plugin adds the appropriate classes that we use to style each
            element. These classes control the overall appearance, as well as the showing and
            hiding via CSS transitions. You can modify any of this with custom CSS or overriding
            our default variables. It's also worth noting that just about any HTML can go within
            the <strong>.accordion-body</strong>, though the transition does limit overflow.
        </ng-template>
    </mdb-accordion-item>

    <mdb-accordion-item>
        <ng-template mdbAccordionItemHeader>Accordion Item #3</ng-template>
        <ng-template mdbAccordionItemBody>
            <strong>This is the third item's accordion body.</strong> It is hidden by default,
            until the collapse plugin adds the appropriate classes that we use to style each
            element. These classes control the overall appearance, as well as the showing and
            hiding via CSS transitions. You can modify any of this with custom CSS or overriding
            our default variables. It's also worth noting that just about any HTML can go within
            the <strong>.accordion-body</strong>, though the transition does limit overflow.
        </ng-template>
    </mdb-accordion-item>
</mdb-accordion>
`;

@Component({
  selector: 'mdb-accordion-test',
  template,
})
class TestAccordionComponent {
  @ViewChildren(MdbAccordionItemComponent) _accordionItems: QueryList<MdbAccordionItemComponent>;
  multiple = false;
  flush = false;

  get accordionItems(): MdbAccordionItemComponent[] {
    return this._accordionItems.toArray();
  }
}

describe('MDB Accordion', () => {
  let fixture: ComponentFixture<TestAccordionComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAccordionComponent],
      imports: [MdbAccordionModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestAccordionComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should toggle item on click', fakeAsync(() => {
    const item = document.querySelector('.accordion-item') as HTMLElement;
    const button = item.querySelector('.accordion-button') as HTMLElement;

    button.click();
    fixture.detectChanges();
    flush();

    const itemCollapse = item.querySelector('.collapse');

    expect(button.classList).not.toContain('collapsed');
    expect(itemCollapse.classList).toContain('show');

    button.click();
    fixture.detectChanges();
    flush();

    expect(button.classList).toContain('collapsed');
    expect(itemCollapse.classList).not.toContain('show');
  }));

  it('should toggle item when toggle method is used', fakeAsync(() => {
    const item = document.querySelector('.accordion-item') as HTMLElement;
    const button = item.querySelector('.accordion-button') as HTMLElement;
    component.accordionItems[0].toggle();

    fixture.detectChanges();
    flush();

    const itemCollapse = item.querySelector('.collapse');

    expect(button.classList).not.toContain('collapsed');
    expect(itemCollapse.classList).toContain('show');

    component.accordionItems[0].toggle();
    fixture.detectChanges();
    flush();

    expect(button.classList).toContain('collapsed');
    expect(itemCollapse.classList).not.toContain('show');
  }));

  it('should allow only one item to be opened if multiple is set to false', fakeAsync(() => {
    const buttons = document.querySelectorAll('.accordion-button');
    const contents = document.querySelectorAll('.collapse');

    component.accordionItems[0].toggle();
    fixture.detectChanges();
    flush();

    expect(buttons[0].classList).not.toContain('collapsed');
    expect(contents[0].classList).toContain('show');

    component.accordionItems[1].toggle();
    fixture.detectChanges();
    flush();

    expect(buttons[0].classList).toContain('collapsed');
    expect(contents[0].classList).not.toContain('show');
    expect(buttons[1].classList).not.toContain('collapsed');
    expect(contents[1].classList).toContain('show');
  }));

  it('should allow multiple items to be opened if multiple is set to true', fakeAsync(() => {
    component.multiple = true;
    fixture.detectChanges();

    const buttons = document.querySelectorAll('.accordion-button');
    const contents = document.querySelectorAll('.collapse');

    component.accordionItems[0].toggle();
    fixture.detectChanges();
    flush();

    expect(buttons[0].classList).not.toContain('collapsed');
    expect(contents[0].classList).toContain('show');

    component.accordionItems[1].toggle();
    fixture.detectChanges();
    flush();

    expect(buttons[0].classList).not.toContain('collapsed');
    expect(contents[0].classList).toContain('show');
    expect(buttons[1].classList).not.toContain('collapsed');
    expect(contents[1].classList).toContain('show');
  }));

  it('should add accordion-flush class if flush is set to true', () => {
    component.flush = true;
    fixture.detectChanges();

    const accordion = document.querySelector('.accordion');

    expect(accordion.classList).toContain('accordion-flush');
  });
});
