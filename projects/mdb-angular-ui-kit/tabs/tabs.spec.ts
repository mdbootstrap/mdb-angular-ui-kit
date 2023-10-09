import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbTabComponent } from './tab.component';
import { MdbTabsComponent } from './tabs.component';
import { MdbTabsModule } from './tabs.module';

const tabsTemplate = `
<mdb-tabs [pills]="pills" [fill]="fill" [justified]="justified" [vertical]="vertical" [navColumnClass]="navColumnClass" [contentColumnClass]="contentColumnClass">
    <mdb-tab title="Tab 1" [disabled]="firstTabDisabled">Tab 1 content</mdb-tab>
    <mdb-tab title="Tab 2" [disabled]="secondTabDisabled">Tab 2 content</mdb-tab>
    <mdb-tab title="Tab 3" [disabled]="thirdTabDisabled">Tab 3 content</mdb-tab>
    <mdb-tab>
      <ng-template mdbTabTitle>
        <span><i class="fab fa-lg fa-mdb me-2"></i>Tab 4</span>
      </ng-template>
      <ng-template mdbTabContent>Tab content 4</ng-template>
    </mdb-tab>
    <mdb-tab *ngIf="showHiddenTab" title="Hidden tab">Hidden tab content</mdb-tab>
</mdb-tabs>
`;

@Component({
  template: tabsTemplate,
})
export class TabsTestComponent {
  pills = false;
  fill = false;
  justified = false;
  vertical = false;
  navColumnClass = 'col-3';
  contentColumnClass = 'col-9';
  firstTabDisabled = true;
  secondTabDisabled = false;
  thirdTabDisabled = false;
  showHiddenTab = false;

  @ViewChild(MdbTabsComponent) tabsComponent: MdbTabsComponent;
  @ViewChildren(MdbTabComponent) tabComponents: QueryList<MdbTabComponent>;
}

describe('MDB Tabs', () => {
  let fixture: ComponentFixture<TabsTestComponent>;
  let component: TabsTestComponent;
  let tabsComponent: MdbTabsComponent;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TabsTestComponent],
      imports: [MdbTabsModule, NoopAnimationsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(TabsTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    tick();
    flush();

    tabsComponent = component.tabsComponent;
  }));

  it('should activate first available tab', () => {
    fixture.detectChanges();

    const tabs = component.tabComponents.toArray();

    expect(tabs[0].active).toBe(false);
    expect(tabs[1].active).toBe(true);
  });

  it('should set show to true and apply show class on first available tab', () => {
    fixture.detectChanges();

    const tabs = component.tabComponents.toArray();
    const tabPanes = fixture.debugElement.queryAll(By.css('.tab-pane'));

    expect(tabs[0].show).toBe(false);
    expect(tabs[1].show).toBe(true);
    expect(tabs[2].show).toBe(false);
    expect(tabPanes[0].nativeElement.classList.contains('show')).toBe(false);
    expect(tabPanes[1].nativeElement.classList.contains('show')).toBe(true);
    expect(tabPanes[2].nativeElement.classList.contains('show')).toBe(false);
  });

  it('should change active tab on tab button click', () => {
    fixture.detectChanges();

    const tabs = component.tabComponents.toArray();
    const tabLinks = fixture.debugElement.queryAll(By.css('.nav-link'));

    expect(tabs[1].active).toBe(true);

    tabLinks[2].nativeElement.click();
    fixture.detectChanges();

    expect(tabs[2].active).toBe(true);
  });

  it('should apply show class after 155ms delay on tab button click', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    const tabs = component.tabComponents.toArray();
    const tabLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
    const tabPanes = fixture.debugElement.queryAll(By.css('.tab-pane'));

    expect(tabs[1].active).toBe(true);
    expect(tabs[1].show).toBe(true);
    expect(tabPanes[1].nativeElement.classList.contains('show')).toBe(true);
    expect(tabs[2].active).toBe(false);
    expect(tabs[2].show).toBe(false);
    expect(tabPanes[2].nativeElement.classList.contains('show')).toBe(false);

    tabLinks[2].nativeElement.click();
    fixture.detectChanges();

    expect(tabs[1].active).toBe(false);
    expect(tabs[1].show).toBe(true);
    expect(tabPanes[1].nativeElement.classList.contains('show')).toBe(true);
    expect(tabs[2].active).toBe(true);
    expect(tabs[2].show).toBe(false);
    expect(tabPanes[2].nativeElement.classList.contains('show')).toBe(false);

    tick(155);
    fixture.detectChanges();

    expect(tabs[1].active).toBe(false);
    expect(tabs[1].show).toBe(false);
    expect(tabPanes[1].nativeElement.classList.contains('show')).toBe(false);
    expect(tabs[2].active).toBe(true);
    expect(tabs[2].show).toBe(true);
    expect(tabPanes[2].nativeElement.classList.contains('show')).toBe(true);
  }));

  it('should add active class to active tab link', () => {
    fixture.detectChanges();

    const tabLinks = fixture.debugElement.queryAll(By.css('.nav-link'));

    expect(tabLinks[1].nativeElement.classList.contains('active')).toBe(true);

    tabLinks[2].nativeElement.click();
    fixture.detectChanges();

    expect(tabLinks[2].nativeElement.classList.contains('active')).toBe(true);
  });

  it('should add disabled class to disabled tab link', () => {
    fixture.detectChanges();

    const tabLinks = fixture.debugElement.queryAll(By.css('.nav-link'));

    expect(tabLinks[0].nativeElement.classList.contains('disabled')).toBe(true);
  });

  it('should add nav-pills class if pills input is set to true', () => {
    component.pills = true;
    fixture.detectChanges();

    const tabNav = fixture.debugElement.query(By.css('.nav'));

    expect(tabNav.nativeElement.classList.contains('nav-pills')).toBe(true);
  });

  it('should add nav-fill class if fill input is set to true', () => {
    component.fill = true;
    fixture.detectChanges();

    const tabNav = fixture.debugElement.query(By.css('.nav'));

    expect(tabNav.nativeElement.classList.contains('nav-fill')).toBe(true);
  });

  it('should add nav-justified class if justified input is set to true', () => {
    component.justified = true;
    fixture.detectChanges();

    const tabNav = fixture.debugElement.query(By.css('.nav'));

    expect(tabNav.nativeElement.classList.contains('nav-justified')).toBe(true);
  });

  it('should add flex-column and text-center classes if vertical input is set to true', () => {
    component.vertical = true;
    fixture.detectChanges();

    const tabNav = fixture.debugElement.query(By.css('.nav'));

    expect(tabNav.nativeElement.classList.contains('flex-column')).toBe(true);
    expect(tabNav.nativeElement.classList.contains('text-center')).toBe(true);
  });

  it('should not set nav and content column classes on horizontal tabs', () => {
    component.vertical = false;
    fixture.detectChanges();

    const tabNav = fixture.debugElement.query(By.css('.nav'));
    const tabContent = fixture.debugElement.query(By.css('.tab-content'));

    expect(tabNav.nativeElement.classList.contains('col-3')).toBe(false);
    expect(tabContent.nativeElement.classList.contains('col-9')).toBe(false);
  });

  it('should correctly set and update nav and content column classes on vertical tabs', () => {
    component.vertical = true;
    fixture.detectChanges();

    const tabNav = fixture.debugElement.query(By.css('.nav'));
    const tabContent = fixture.debugElement.query(By.css('.tab-content'));

    expect(tabNav.nativeElement.classList.contains('col-3')).toBe(true);
    expect(tabContent.nativeElement.classList.contains('col-9')).toBe(true);

    component.navColumnClass = 'col-6';
    component.contentColumnClass = 'col-6';
    fixture.detectChanges();

    expect(tabNav.nativeElement.classList.contains('col-3')).toBe(false);
    expect(tabContent.nativeElement.classList.contains('col-9')).toBe(false);
    expect(tabNav.nativeElement.classList.contains('col-6')).toBe(true);
    expect(tabContent.nativeElement.classList.contains('col-6')).toBe(true);
  });

  it('should not activate disabled tab programmaticaly', () => {
    const tabs = component.tabComponents.toArray();

    expect(tabs[0].disabled).toBe(true);
    expect(tabs[0].active).toBe(false);

    component.tabsComponent.setActiveTab(0);
    fixture.detectChanges();

    expect(tabs[0].active).toBe(false);
  });

  it('should not change current active tab when tab list is updated', () => {
    const tabs = component.tabComponents.toArray();

    expect(tabs[1].active).toBe(true);

    component.showHiddenTab = true;
    fixture.detectChanges();

    expect(tabs[1].active).toBe(true);
  });

  it('should activate first available on tab list change if no tab is active', () => {
    let tabs = component.tabComponents.toArray();

    expect(tabs[1].active).toBe(true);

    tabs[1].active = false;
    component.secondTabDisabled = true;
    fixture.detectChanges();

    component.showHiddenTab = true;
    fixture.detectChanges();

    tabs = component.tabComponents.toArray();

    expect(tabs[1].active).toBe(false);
    expect(tabs[2].active).toBe(true);
  });

  it('should render custom title content when mdbTabTitle directive and ng-template is used', () => {
    const span = fixture.nativeElement.querySelector('span');
    const customTabIcon = span.querySelector('i');

    expect(customTabIcon).toBeTruthy();
    expect(span.textContent).toEqual('Tab 4');
  });

  it('should lazy load tab content if mdbTabContent directive and ng-template is used', () => {
    const tabPanes = fixture.nativeElement.querySelectorAll('.tab-pane');

    expect(tabPanes[3].textContent).toEqual('');

    component.tabsComponent.setActiveTab(3);
    fixture.detectChanges();

    expect(tabPanes[3].textContent).toEqual('Tab content 4');
  });
});
