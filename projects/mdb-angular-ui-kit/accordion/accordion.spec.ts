import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbAccordionItemComponent } from './accordion-item.component';
import { MdbAccordionModule } from './accordion.module';

const ANIMATION_TIME = 350; // animation time from collapse directive

const template = `
<mdb-accordion [multiple]="multiple" [flush]="flush" [borderless]="borderless">
    <mdb-accordion-item [disabled]="disabled">
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
  borderless = false;
  disabled = false;

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

  it('should add accordion-borderless class if borderless is set to true', () => {
    const accordion = document.querySelector('.accordion');

    expect(accordion.classList).not.toContain('accordion-borderless');

    component.borderless = true;
    fixture.detectChanges();

    expect(accordion.classList).toContain('accordion-borderless');
  });

  it('should emit correct events on item collapse and expand', fakeAsync(() => {
    const item = component.accordionItems[0];

    const showSpy = jest.spyOn(item.itemShow, 'emit');
    const shownSpy = jest.spyOn(item.itemShown, 'emit');
    const hideSpy = jest.spyOn(item.itemHide, 'emit');
    const hiddenSpy = jest.spyOn(item.itemHidden, 'emit');

    item.show();
    fixture.detectChanges();

    expect(showSpy).toHaveBeenCalled();
    expect(shownSpy).not.toHaveBeenCalled();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(shownSpy).toHaveBeenCalled();

    item.hide();
    fixture.detectChanges();

    expect(hideSpy).toHaveBeenCalled();
    expect(hiddenSpy).not.toHaveBeenCalled();

    tick(ANIMATION_TIME);
    flush();
    fixture.detectChanges();

    expect(hiddenSpy).toHaveBeenCalled();
  }));

  it('should not toggle item on click when disabled input is set to true', fakeAsync(() => {
    component.disabled = true;
    fixture.detectChanges();

    const item = document.querySelector('.accordion-item') as HTMLElement;
    const button = item.querySelector('.accordion-button') as HTMLButtonElement;
    const itemCollapse = item.querySelector('.collapse') as HTMLDivElement;

    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.classList).toContain('collapsed');
    expect(itemCollapse.classList).not.toContain('show');

    button.click();
    fixture.detectChanges();
    flush();

    expect(button.classList).toContain('collapsed');
    expect(itemCollapse.classList).not.toContain('show');
  }));
});
