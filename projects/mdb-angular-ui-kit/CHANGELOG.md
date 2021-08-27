## 1.0.0-beta8 (12.07.2021)

In this version we introduced some breaking changes, please check `Breaking changes` section and update your application accordingly.

### Breaking changes:

- Popover - `[template]` input will now accept value of type `TemplateRef` and can be used to display `ng-template` content.

### Fixes and improvements:

- Toast - component will no longer throw error after reopening,
- Toast - stacked components will now slide up automatically,
- Sidenav - resolved problem with auto expand when route has route parameters,
- Dropdown - opened menu will be now correctly destroyed on route change,
- Table pagination - resolved problem with data automatic updates after change in `[entryOptions]` input.

### New components:

- [Popconfirm](https://mdbootstrap.com/docs/b5/angular/components/popconfirm/)
- [Lazy loading](https://mdbootstrap.com/docs/b5/angular/methods/lazy-loading/)
- [Loading management](https://mdbootstrap.com/docs/b5/angular/methods/loading-management/)

### New features:

- Popover - `[template]` input will now accept value of type `TemplateRef` and can be used to display `ng-template` content.

---

## 1.0.0-beta7 (28.06.2021)

In this version we introduced some breaking changes, please check `Breaking changes` section and update your application accordingly.

### Breaking changes:

- Changed `mdb-select-option` selector to `mdb-option`,
- Removed `select-` prefix from option and option group class names,
- Moved option and option group styles to individual file.

### Fixes and improvements:

- Sidenav - resolved problem with arrow icons in collapsed items,
- Sidenav - resolved problem with z-index,
- Select - resolved problem with dropdown toggle on arrow icon click,
- Input - resolved problem with label position when setting value dynamically using Angular form controls.

### New components:

- [Autcomplete](https://mdbootstrap.com/docs/b5/angular/forms/autocomplete/)
- [Infinite scroll](https://mdbootstrap.com/docs/b5/angular/methods/infinite-scroll/)
- [Touch](https://mdbootstrap.com/docs/b5/angular/methods/touch/)

### New features:

- Select - added new `[filterPlaceholder]` input that allow to change filter input placeholder.

---

## 1.0.0-beta6 (14.06.2021)

In this version we introduced some breaking changes, please check `Breaking changes` section and update your application accordingly. The list of all individual modules and entry points can be found here:

[MDB Angular UI Kit Free Modules And Imports](https://mdbootstrap.com/docs/b5/angular/getting-started/modules-and-imports/)

[MDB Angular UI Kit Pro Essential Modules And Imports](https://mdbootstrap.com/docs/b5/angular/pro/modules-and-imports/)

### Breaking changes:

- Updated Angular to v12 (this version is now required),
- Components, modules and types can no longer be imported from `mdb-angular-ui-kit` entry point. Use the newly added secondary entry points, such as `mdb-angular-ui-kit/checkbox` to import individual elements,
- Removed main `MdbModule`, import individual modules from its entry points, for example: `import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox'`,
- Renamed `MdbTimePickerComponent` to `MdbTimepickerComponent`,
- Renamed `MdbTimePickerDirective` to `MdbTimepickerDirective`,
- Renamed `MdbTimePickerModule` to `MdbTimepickerModule`,
- Updated Bootstrap styles to the latest stable version.

### Components redesign:

- Redesigned shadows for components: Cards, Dropdowns, Modal, Popover, Toasts, Buttons, Button Group, Navbar, Pagination, Pills, Sidenav,
- Redesigned padding for components: Alerts, Cards, List Group,
- Redesigned border radius to 0.5rem for components: Alerts, Cards, Dropdowns, Modal, List group, Popover, Toasts, Dateipcker, Timepicker.

### Fixes and improvements:

- Sidenav - resolved problem with height of the element with `.sidenav-menu` class,
- Range - resolved problem with a hardcoded `Example label` text,
- Datepicker - `dateChanged` event will be now correctly emited on date change,
- Datepicker - resolved problem with components updates on Angular form control changes,
- File input - updated styles to Material Design styles,
- Pills - fixed width of pills when they're filled or justified,
- Checkbox/Switch/Radio - fix margin styles and positioning.

### New components:

- [Stepper](https://mdbootstrap.com/docs/b5/angular/components/stepper/)
- [Sticky](https://mdbootstrap.com/docs/b5/angular/components/sticky/)

### New features:

- Navbar - added a new `.navbar-nav-scroll` class to enable vertical scrolling when a collapsed navbar is opened,
- Navbar - re-added `flex-grow` to the `.navbar-collapse` to restore the flexbox behaviors from v4 and prevent some content from being inadvertently squished,
- List group - added a new `.list-group-numbered` variation to list groups that uses pseudo-elements for numbering list group items,
- Shadows - added a new styles design: shadows soft, shadows standard, shadows strong,
- Added color-scheme mixin.

---

## 1.0.0-beta5 (31.05.2021)

### New components:

- [Datatables](https://mdbootstrap.com/docs/b5/angular/data/datatables/)
- [Rating](https://mdbootstrap.com/docs/b5/angular/components/rating/)

---

## 1.0.0-beta4 (04.05.2021)

### New components:

- [Charts](https://mdbootstrap.com/docs/b5/angular/data/charts/)

### Bug fixes:

- Animations - resolved problem with parameters in HTML template,
- Sidenav - resolved problems with `mode` and `hidden` inputs,
- Sidenav - resolved problem with `show` method.

---

## 1.0.0-beta3 (19.04.2021)

### New components:

- [Alerts](https://mdbootstrap.com/docs/b5/angular/components/alerts/)
- [Carousel](https://mdbootstrap.com/docs/b5/angular/components/carousel)
- [Toasts](https://mdbootstrap.com/docs/b5/angular/components/toasts)

### Bug fixes:

- Datepicker - resolved problem with keyboard navigation when using `DownArrow` key,
- Datepicker - resolved problem with selecting dates using `Enter/Space` keys in component with date filter,
- Datepicker - added correct aria-labels to the previous/next buttons in the days view.

---

## 1.0.0-beta2 (06.04.2021)

### New components:

- [Datepicker](https://mdbootstrap.com/docs/b5/angular/forms/datepicker/)
- [Timepicker](https://mdbootstrap.com/docs/b5/angular/forms/timepicker)

---

## 1.0.0-beta1 (22.03.2021)

### New components:

- [Range](https://mdbootstrap.com/docs/b5/angular/forms/range/)
- [File](https://mdbootstrap.com/docs/b5/angular/forms/file)
- [Switch](https://mdbootstrap.com/docs/b5/angular/forms/switch/)
- [Input group](https://mdbootstrap.com/docs/b5/angular/forms-input-group/)
- [Pills](https://mdbootstrap.com/docs/b5/angular/navigation/pills/)
- [Tabs](https://mdbootstrap.com/docs/b5/angular/navigation/tabs/)

### Bug fixes:

- Scrollspy - added `cursor: pointer` styles to scrollspy links,
- Sidenav - resolved problem with errors when `RouterModule` is not imported,
- Sidenav - component will be correctly updated on inputs changes,
- Sidenav - resolved problem with scroll position,
- Sidenav - added components and module exports to main library index.

### New features:

- Animations - added new animations: `slideLeft`, `slideRight`, `slideUp`, `slideDown`,
- Sidenav - added focus trap,
- Sidenav - escape button will now close the component.

---

## 1.0.0-alpha4 (08.03.2021)

### New components:

- [Animations](https://mdbootstrap.com/docs/b5/angular/content-styles/animations/)
- [Ripple](https://mdbootstrap.com/docs/b5/angular/methods/ripple/)
- [Sidenav](https://mdbootstrap.com/docs/b5/angular/navigation/sidenav/)
- [Scrollspy](https://mdbootstrap.com/docs/b5/angular/navigation/scrollbar/)
- [Validation](https://mdbootstrap.com/docs/b5/angular/forms/validation/)

### Bug fixes:

- Select - `x options selected` text will be displayed correctly when more than 5 options have been selected,
- Select - fixed clear button focusing issue.

### New features:

- Select - added new `displayedLabels` input that allows to change maximum number of comma-separated options labels displayed in the multiselect input,
- Select - added new `optionsSelectedLabel` input that allows to customize x options selected text,
- Select - added new `filterDebounce` input that allows to add delay to the options list updates when using filter input

---

## 1.0.0-alpha3 (22.02.2021)

### New components:

- [Dropdown](https://mdbootstrap.com/docs/b5/angular/components/dropdowns/)
- [Modal](https://mdbootstrap.com/docs/b5/angular/components/modal/)
- [Select](https://mdbootstrap.com/docs/b5/angular/forms/select/)
- [Scrollbar](https://mdbootstrap.com/docs/b5/angular/methods/scrollbar/)

---

## 1.0.0-alpha2 (25.01.2021)

### New components:

- [Popover](https://mdbootstrap.com/docs/b5/angular/components/popovers/)
- [Tooltip](https://mdbootstrap.com/docs/b5/angular/components/tooltips/)
- [Checkbox](https://mdbootstrap.com/docs/b5/angular/forms/checkbox/)
- [Input](https://mdbootstrap.com/docs/b5/angular/forms/input-fields/)
- [Radio](https://mdbootstrap.com/docs/b5/angular/forms/radio/)

---

## 1.0.0-alpha1 (11.01.2021)

The initial release of MDB 5 Angular Alpha 1.

### New components:

- [Badges](https://mdbootstrap.com/docs/b5/angular/components/badges/)
- [Buttons](https://mdbootstrap.com/docs/b5/angular/components/buttons/)
- [Button Group](https://mdbootstrap.com/docs/b5/angular/components/button-group/)
- [Cards](https://mdbootstrap.com/docs/b5/angular/components/cards/)
- [Collapse](https://mdbootstrap.com/docs/b5/angular/components/collapse/)
- [List Group](https://mdbootstrap.com/docs/b5/angular/components/list-group/)
- [Progress](https://mdbootstrap.com/docs/b5/angular/components/progress/)
- [Spinners](https://mdbootstrap.com/docs/b5/angular/components/spinners/)
- [Tables](https://mdbootstrap.com/docs/b5/angular/data/tables/)
- [Breadcrumb](https://mdbootstrap.com/docs/b5/angular/navigation/breadcrumb/)
- [Footer](https://mdbootstrap.com/docs/b5/angular/navigation/footer/)
- [Headers](https://mdbootstrap.com/docs/b5/angular/navigation/headers/)
- [Navbar](https://mdbootstrap.com/docs/b5/angular/navigation/navbar/)
- [Pagination](https://mdbootstrap.com/docs/b5/angular/navigation/pagination/)

### New sections:

- Layout
- Utilities
- Content & styles
