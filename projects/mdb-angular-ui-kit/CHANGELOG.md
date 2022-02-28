## 2.0.0 (28.02.2022)

### Breaking changes:

- Added support for Angular 13, this Angular version is now required,
- Sidenav - removed support for automatic item expansion based on an active link ([in our documentation](https://mdbootstrap.com/docs/b5/angular/navigation/sidenav/) you can find information on how to achieve this effect using methods provided by Angular Router).

### Dependencies:

- Updated Font Awesome to v6.0.0

### Fixes and improvements:

- Toasts/Alerts - resolved problem with positioning when stacking and position bottom options are used,
- Select/Datepicker - resolved problems with input, label and icons styles when `form-white` class is used on `mdb-form-control` component,
- Select - resolved problem with selection when multiple options have the same label (in some cases component incorrectly displayed option value instead of option label in input),
- Datatable pagination - component will now display correct information when data source is empty.

### New features:

- Tabs - added new `[navColumnClass]` and `[contentColumnClass]` inputs that allow to customize width of the navigation and content sections in vertical mode.

---

## 1.6.1 (24.01.2022)

### Optimization:

- Documentation migration from Wordpress to Hugo,
- Updated code in snippets in documentation to work properly with tsconfig strict settings.

### Fixes and improvements:

- Input - resolved problem with label position in input with type="date",
- Datepicker/Timepicker - improved backdrop animation (removed unnecessary delay),
- Datepicker - resolved problem with navigation using previous/next arrows when min and max date is specified,
- Sidenav - animation of the collapsed item in slim mode will be now in sync with animation of the menu (previously there was unnecessary delay)
- Select - list of filtered options will be now correctly reset after the dropdown menu is closed,
- Treeview plugin - click on checkbox will no longer change collapsed state of the node,
- Treeview plugin - checked state of the checkox in parent node will be now in sync with the checkboxes in child nodes.

---

## 1.6.0 (27.12.2021)

### Dependencies:

- Updated Bootstrap to 5.1.3 version.

### Fixes and improvements:

- Charts - resolved problem with `chartjs-plugin-datalabels` configuration,
- Carousel - component should now work correctly inside components with `OnPush` change detection strategy,
- Table - updated `dataSource` type to resolve problem with asynchronous data and async pipe,
- File upload plugin - resolved problem with extensions handled by the `acceptedExtensions` input,
- Popconfirm - target element will be now optional in modal display mode,
- Sidenav - resolved problem with `child.querySelector is not a function` error when using `ngFor` directive to render sidenav items,
- Popover - `mdbPopover` input will now correctly accept value with `TemplateRef` type.

### New:

- Dropdown - added new `closeOnOutsideClick`, `closeOnItemClick`, `closeOnEsc` inputs that allow to configure menu closing actions,
- File upload plugin - added a new `reset` method that allow to reset component state to default settings.

---

## 1.5.1 (22.11.2021)

### Fixes and improvements

- Toast/Alert - resolved problem with stacking and close animation,
- Modal - resolved problem with closing when mouseup event is detected outside the component,
- Sidenav - setting `hidden` input to `false` will no longer trigger component animation,
- Sidenav - resolved problem with arrow rotation update when `[collapsed]="false"` is used,
- Sidenav - removed focus trap in side and push modes,
- Sidenav - default position will be now correctly set to `fixed`,
- Input - resolved problem with border top gap recalculation when used inside a dynamically loaded component (such as tabs),
- Overlay - resolved problem with z-index in components using overlay (e.g. modal, popconfirm, tooltip, components with dropdown menus). The components will be correctly displayed above the elements with sticky/fixed styles,
- Charts - fixed default options and resolved problem with custom options merge.

### Vector maps 1.1.0:

- resolved problem with automatic updates of colors defined in `colorMap`,
- resolved problem with tooltip display when `[hover]="false"` is used,
- added possibility to display custom tooltips.

---

## 1.5.0 (02.11.2021)

### New

- [File upload](https://mdbootstrap.com/docs/b5/angular/plugins/file-upload)
- [Treeview](https://mdbootstrap.com/docs/b5/angular/plugins/tree-view)

---

## 1.4.0 (18.10.2021)

### New

- [Drag and drop](https://mdbootstrap.com/docs/b5/angular/plugins/drag-and-drop)
- [Vector maps](https://mdbootstrap.com/docs/b5/angular/plugins/vector-maps)

---

## 1.3.0 (04.10.2021)

### New

- [Wysiwyg](https://mdbootstrap.com/docs/b5/angular/plugins/wysiwyg-editor)

### Fixes and improvements:

- Popover/Tooltip - resolved problem with closing component when quickly moving mouse over trigger element

---

## 1.2.0 (20.09.2021)

### New

- [Calendar](https://mdbootstrap.com/docs/b5/angular/plugins/calendar)
- [Table Editor](https://mdbootstrap.com/docs/b5/angular/plugins/table-editor)

---

## 1.1.0 (06.09.2021)

### Fixes and improvements:

- Table pagination - resolved problem with disabled state of next button,
- Input - resolved problem with disabled state updates using Angular form control methods,
- Table - resolved problem with default filter function,
- Datepicker - resolved problem with disabled state of toggle button,
- Timepicker - resolved problem with setting default value in component with 24h format,
- Sidenav - resolved problem with `Cannot read property destroy of undefined` error,
- Select - resolved problem with disabled state of checkboxes in options,
- Select - resolved problem with closing modal on clear button click,
- Dropdown - menu will be now closed correctly on item click.

### New components:

- [Theming](https://mdbootstrap.com/docs/b5/angular/content-styles/theme)

### New features:

- Table pagination - added new `rowsPerPageText` input that allow to change default 'Rows per page' text

---

## 1.0.0 (09.08.2021)

In this version we introduced some breaking changes, please check `Breaking changes` section and update your application accordingly.

### Breaking changes:

- Inputs - removed `margin-bottom` styles from inputs with validation classes.

### Fixes and improvements:

- Select - dropdown will be correctly removed on component destroy,
- Select - resolved problem with select-all option state on component initialization,
- Select - resolved problem with selection of options with false values,
- Dropdown - resolved problem with opening component on icon click,
- Toasts/Alerts - resolved problem with z-index,
- Popconfirm - resolved problem with `onClose` and `onConfirm` events,
- Loading management - backdrop will be correctly removed on component destroy when fullscreen option is used,
- Timepicker - resolved problem with setting default value using Angular form controls,
- Datepicker - previous/next button disabled state will be now correctly updated on component initialization,
- Datepicker/Timepicker - click on toggle button will no longer submit form,
- Datepicker/Timepicker - resolved problems with `valueChanges` event and validation status updates,
- Datatables - resolved problem with scroll position when component is rendered inside a tab.

### New components:

- [Accordion](https://mdbootstrap.com/docs/b5/angular/components/accordion/)
- [Charts advanced](https://mdbootstrap.com/docs/b5/angular/data/charts-advanced/)
- [Lightbox](https://mdbootstrap.com/docs/b5/angular/components/lightbox/)
- [Smooth scroll](https://mdbootstrap.com/docs/b5/angular/methods/smooth-scroll/)

---

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
