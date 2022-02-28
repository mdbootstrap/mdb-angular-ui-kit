import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MdbTabComponent } from './tab.component';
import { MdbTabsComponent } from './tabs.component';
import { MdbTabsModule } from './tabs.module';

const tabsTemplate = `
<mdb-tabs [pills]="pills" [fill]="fill" [justified]="justified">
    <mdb-tab title="Tab 1" [disabled]="true">Tab 1 content</mdb-tab>
    <mdb-tab title="Tab 2">Tab 2 content</mdb-tab>
    <mdb-tab title="Tab 3">Tab 3 content</mdb-tab>
</mdb-tabs>
`;

@Component({
  template: tabsTemplate,
})
export class TabsTestComponent {
  pills = false;
  fill = false;
  justified = false;

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
      imports: [MdbTabsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(TabsTestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    tick();

    tabsComponent = component.tabsComponent;
  }));

  it('should activate first available tab', () => {
    fixture.detectChanges();

    const tabs = component.tabComponents.toArray();

    expect(tabs[0].active).toBe(false);
    expect(tabs[1].active).toBe(true);
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
});
