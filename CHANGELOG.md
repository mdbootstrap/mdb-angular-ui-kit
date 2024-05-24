## 6.1.0 (27.05.2024)

### Fixes and improvements:

- [Multi range](https://mdbootstrap.com/docs/angular/forms/multi-range-slider/)
  - Fixed problem with thumb limiting logic when using custom step
  - Fixed problem with updating thumb positions via form controls
- [Popconfirm](https://mdbootstrap.com/docs/angular/components/popconfirm/) - added focus trap
- [Autocomplete](https://mdbootstrap.com/docs/angular/forms/autocomplete/) - restored native `shift + home` and `shift + end` keys behavior (open/close dropdown)
- [Select](https://mdbootstrap.com/docs/angular/forms/select/) - added support for opening and closing dropdown with `alt + arrow-up` and `alt + arrow-down` keys
  
### New:

- [Table pagination](https://mdbootstrap.com/docs/angular/data/datatables/) - added new `page` input that allows to set page number
- [Multi range](https://mdbootstrap.com/docs/angular/forms/multi-range-slider/) - added new `highlightRange` input that allows to highlight range
- [Parallax](https://mdbootstrap.com/docs/angular/plugins/parallax/) - added new `container` input that allows to set wrapper element for parallax effect
  
---

## 6.0.0 (15.01.2024)

This version requires Angular v17. Follow the [Angular Update Guide](https://update.angular.io/?l=3&v=16.0-17.0) to migrate your project to Angular 17.

### Breaking changes:
  
- Updated Angular to v17, this version is required in MDB Angular v6
- [Calendar](https://mdbootstrap.com/docs/angular/plugins/calendar/) - changed type of `defaultView` input from `string` to `MdbCalendarView`
- [Datepicker](https://mdbootstrap.com/docs/angular/forms/datepicker/) - changed type of `options` input from `any` to `MdbDatepickerOptions`
- [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/)
  - Changed type of `options` input from `Options` to `MdbTimepickerOptions` and made all parameters optional
  - Changed `SelectedTime` type name to `MdbTimepickerSelectedTime` and added this type to public exports
- [Popover](https://mdbootstrap.com/docs/angular/components/popover/) - removed unused `template` input
- [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/)
  - Changed return type of all events from `MdbSidenavComponent` to `void`
  - Removed redundant `li` element from `MdbSidenavItemComponent` template
- [Transfer](https://mdbootstrap.com/docs/angular/plugins/transfer/)
  - Changed `onSearchOutput` event name to `searchOutput`
  - Changed `selectOutput` event name to `selectOutput`
  - Changed `onChange` event name to `listChange`
  - Changed `onSearch` event name to `itemSearch`
  - Changed `onSelect` event name to `itemSelect`
        
### Fixes and improvements:
  
- [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/) - removed height animation transition
- [Select](https://mdbootstrap.com/docs/angular/forms/select/) - blocked input clearing in disabled component
- [Input fields](https://mdbootstrap.com/docs/angular/forms/input-fields/) - resolved problem with default label position in all inputs with built-in placeholder (like `datetime-local` or `time`)
- [Lightbox](https://mdbootstrap.com/docs/angular/components/lightbox/) - resolved problem with component removal from DOM after using browser's back button
- [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/) - resolved problem with font size in landscape view

### New fetures:
  
- [Select](https://mdbootstrap.com/docs/angular/forms/select/) - added new `inputId` and `inputFilterId` inputs that allow to declare ids for input elements

---
  
## 5.2.0 (04.12.2023)

### Fixes and improvements:

- Resolved problem with components rendering when using Server Side Rendering
- Resolved problem with overlay when using `menuPositionClass` in [Datatable](https://mdbootstrap.com/docs/angular/components/dropdowns/)
- Replaced hardcoded `padding-left` value in [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/) link with a value from CSS variable
- Replaced hardcoded `box-shadow`, `border-color` and `background-color` values in [Buttons](https://mdbootstrap.com/docs/angular/components/buttons/) with a values from CSS variables
- [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/)
  - Fixed the button press behavior to consider the duration of the press
  - Removed the default scroll effect from the arrow keydown events in inline mode
- Fixed events types for `opened` and `closed` events in [Datepicker](https://mdbootstrap.com/docs/angular/forms/datepicker/)
- Resolved problem with initial value in [Rating](https://mdbootstrap.com/docs/angular/components/rating)
- [Multi Range Slider](https://mdbootstrap.com/docs/angular/forms/multi-range-slider/)
  - Resolved problem with thumbs position updates on `ngModel` or `formControl` value changes
  - Added thumbs position constraints so that the position of a given thumb is limited by its counterpart
- Resolved problem with the `Host already has a portal attached` error in [Wysiwyg](https://mdbootstrap.com/docs/angular/plugins/wysiwyg-editor/)

### New:

- A new `MdbSidenavMenuDirective` directive has been added to [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/) allowing to create multiple menus within one component
- A new `size` input has been added to [Select](https://mdbootstrap.com/docs/angular/orms/select/) allowing to change input size to `sm` or `lg`

---

## 5.1.0 (09.10.2023)

### Fixes and improvements:

- [Datatable](https://mdbootstrap.com/docs/angular/data/datatables/)
  - Added missing `cursor: pointer` styles to clickable rows
  - Resolved problems with pagination width styles
  - Resolved problems with page number calculation in pagination
- [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/)
  - Resolved problems with accessibility
  - Removed the need to define template variables in HTML template
  - Adjusted padding in slim version to correctly display link icon and arrow
- [Tabs](https://mdbootstrap.com/docs/angular/navigation/tabs/)
  - Improved animation smoothness
  - Added `MdbTabChange` event type to public exports
- [Datepicker](https://mdbootstrap.com/docs/angular/forms/datepicker/)
  - Resolved problem with `disabled` input
  - Resolved problem with disabling and enabling component via Reactive Forms methods
  - Removed border styles from focused buttons
- [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/)
  - Resolved problem with border radius styles
  - Resolved problem with disabling and enabling component via Reactive Forms methods
- [Autocomplete](https://mdbootstrap.com/docs/angular/forms/autocomplete/)
  - Removed auto highlight from first option
  - Resolved problems with input and dropdown keyboard navigation when using `HOME` and `END` keys
- [Multi range](https://mdbootstrap.com/docs/angular/forms/multi-range-slider/)
  - Resolved problem with component render in apps using Angular 16
  - Resolved problem with unhandled `endDrag` event
- [Onboarding](https://mdbootstrap.com/docs/angular/plugins/onboarding/)
  - Resolved problem with component render in apps using Angular 16
  - Resolved problems with popover styles
  - Fixed event types
  - Fixed event emitted when jumping to next step
- [Treeview](/docs/angular/plugins/tree-view/)
  - Improved animation smoothness
  - Added correct types to public events
  - Resolved problem with `accordion` option
  - Resolved problem with `openOnClick` option
  - Improved accessibility
- Resolved problem with styles of anchor elements used as [floating buttons](https://mdbootstrap.com/docs/angular/components/buttons/#section-floating)
- Resolved problem with adding new [Chips](https://mdbootstrap.com/docs/angular/components/chips/) on blur event
- Resolved problem with [Dropdown](https://mdbootstrap.com/docs/angular/components/dropdowns/) menu position
- Fixed focus styles in [Select](https://mdbootstrap.com/docs/angular/forms/select/) with `form-white` class
- Resolved problem with position of bottom frame [non-invasive Modal](https://mdbootstrap.com/docs/angular/components/modal/#section-non-invasive-modal)
- Fixed type of `infiniteScrollCompleted` event in [Infinite scroll](https://mdbootstrap.com/docs/angular/methods/infinite-scroll/)
- Added mechanism to handle dynamic updates in [Input mask](https://mdbootstrap.com/docs/angular/plugins/input-mask/) plugin
- Resolved problems with [Color picker](https://mdbootstrap.com/docs/angular/plugins/color-picker/) plugin styles and slider in Firefox browser
- Resolved problem with [Parallax](https://mdbootstrap.com/docs/angular/plugins/parallax/) plugin render in apps using Angular 16
- Fixed event types and unhandled events in [Drag and drop](https://mdbootstrap.com/docs/angular/plugins/drag-and-drop/) plugin
- Resolved problem with reverting lists transformation in [WYSIWYG editor](https://mdbootstrap.com/docs/angular/plugins/wysiwyg-editor/) plugin
- Resolved problem with `changeView` method in [Calendar](https://mdbootstrap.com/docs/angular/plugins/calendar/) plugin
- Added types to public exports in [Data parser](https://mdbootstrap.com/docs/angular/plugins/data-parser/) plugin

### New:

- Added new [Treetable](https://mdbootstrap.com/docs/angular/plugins/treetable/) plugin
- Added mechanism that allow to add context for `ng-template` template in [Popover](https://mdbootstrap.com/docs/angular/components/popovers/)
- Added new `showAllEntries` option to [Datatable pagination](https://mdbootstrap.com/docs/angular/data/datatables/)
- Added new `filterFn` option to [Select](https://mdbootstrap.com/docs/angular/forms/select/)
- Added new directive that allow to create a custom header in [Datepicker](https://mdbootstrap.com/docs/angular/forms/datepicker/)
- Added new `positionClass` and `menuPositionClass` options to [Dropdown](https://mdbootstrap.com/docs/angular/components/dropdowns/)
- Added new `disabled` input that allow to disable [Accordion](https://mdbootstrap.com/docs/angular/components/accordion/)Accordion</a> items
- Added mechanism that allow to define custom icon template with `ng-template` in [Datepicker](/docs/angular/forms/datepicker/) and [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/)
- Added mechanism that allow to define custom header template with `ng-template` in [Stepper](https://mdbootstrap.com/docs/angular/components/stepper/)
- Added new `$link-decoration` and `--mdb-link-decoration` variables to make it easier to customize `text-decoration` styles for anchor elements
- Added new inputs for disabling specific features in [Calendar](https://mdbootstrap.com/docs/angular/plugins/calendar/) plugin

---

## 5.0.0 (26.06.2023)

This version requires Angular v16. Follow the [Angular update guide](https://update.angular.io/?l=3&v=15.0-16.0) to migrate your project to Angular 16.

### Dependencies:

- Updated Angular to v16, this version is required in MDB Angular v5
- Updated Bootstrap to [5.2.3](https://github.com/twbs/bootstrap/releases/tag/v5.2.3) version.

### Design changes:

- Changed arrow styles in [Select](https://mdbootstrap.com/docs/angular/forms/select/) input
- Slightly changed hover styles in [outline buttons](https://mdbootstrap.com/docs/angular/components/buttons/#section-outline) to make them more elegant and subtle

### Fixes and improvements:

- Fixed problems with schematics installation in MDB Angular Free version
- Fixed problem with display of [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/) item when its content is translated with the `translate` pipe from the `@ngx-translate` library
- Fixed position of smaller icons in relation to the text in [Rating](https://mdbootstrap.com/docs/angular/components/rating/)

### New:

- Converted MDB components to CSS variables
- Added SCSS and CSS variables for `mdb-option` and `mdb-option-group` components
- Added access to the underlying component instance from ref element in [Modal](https://mdbootstrap.com/docs/angular/components/modal/), [Popconfirm](https://mdbootstrap.com/docs/angular/components/popconfirm/), [Alerts](https://mdbootstrap.com/docs/angular/components/alerts/) and [Toasts](https://mdbootstrap.com/docs/angular/components/toasts/)

---

## 4.1.0 (24.01.2023)

### Fixes and improvements:

- Fixed default value display in [Autocomplete](https://mdbootstrap.com/docs/angular/forms/autocomplete/) when the value is an object
- [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/)
  - Fixed focus trap
  - Fixed keyboard navigation in inline mode
  - Fixed the problem with minTime and maxTime range
- Fixed [Ripple effect](https://mdbootstrap.com/docs/angular/methods/ripple/) on inputs styled as buttons
- Fixed background colors of [Toasts](https://mdbootstrap.com/docs/angular/components/toasts/) and [Alerts](https://mdbootstrap.com/docs/angular/components/alerts/) in MDB theme
- [Modal](https://mdbootstrap.com/docs/angular/components/modal/)
  - Fixed the problem with scrollbar on bottom frame modal init
  - Removed rounded corners from frame modals
  - Removed unnecessary body scroll when using `scrollable` modal
- [Datatable](https://mdbootstrap.com/docs/angular/data/datatables/)
  - Removed ability to focus disabled buttons in pagination
  - Fixed the problem with case-sensitive sorting
- Fixed the problem with hiding buttons in the [Wysiwyg](https://mdbootstrap.com/docs/angular/plugins/wysiwyg-editor/) toolbar
- Fixed problem with event types in [Select](https://mdbootstrap.com/docs/angular/forms/select/)
- Fixed problem with `Rxjs operators` import paths in all the components and plugins

### New:

- Added new [Data Parser](https://mdbootstrap.com/docs/angular/plugins/data-parser/) plugin
- Added new [Organization Chart](https://mdbootstrap.com/docs/angular/plugins/organization-chart/) plugin
- Added new [Captcha](https://mdbootstrap.com/docs/angular/plugins/captcha/) plugin
- Added new [Chips](https://mdbootstrap.com/docs/angular/components/chips/) component
- Added new `[collapsible]` input to [Scrollspy](https://mdbootstrap.com/docs/angular/navigation/scrollspy/)
- Added new `[disableWindowScroll]` input to the [Sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/)
- Added new [non-invasive Modal](https://mdbootstrap.com/docs/angular/components/modal/#section-non-invasive-modal)
- [Datatable](https://mdbootstrap.com/docs/angular/data/datatables/)
  - Added new `[forceSort]` input that allow to disable sort reset on third click
  - Added new `[disableSort]` input that allow to disable a specific sort header
  - Added new `[disabled]` input to pagination component
- [Datepicker](https://mdbootstrap.com/docs/angular/forms/datepicker/)
- Added new `[removeOkBtn]`, `[removeCancelBtn]` and `[removeClearBtn]` inputs that allow to remove specific buttons from the component footer
- Addew new `[confirmDateOnSelect]` input that allow to select date without a confirmation by click on `Ok` button

---

## 4.0.0 (09.01.2023)

### Design updates:

Our basic color palette has been updated. We toned down our colors to be less flashy and more elegant and subtle. This affects virtually all of our components, so be aware of this before upgrading your project to v4.0.0.

Read [colors docs](https://mdbootstrap.com/docs/angular/content-styles/colors/) to learn more about new palette.

### Breaking changes:

- Added support for Angular 15, this Angular version is now required,
- Improved [buttons](https://mdbootstrap.com/docs/angular/components/buttons/)
- Improved existing [accordion](https://mdbootstrap.com/docs/angular/components/accordion/) and added new examples
- Improved [stepper](https://mdbootstrap.com/docs/angular/components/stepper/) design
- Improved [badges](https://mdbootstrap.com/docs/angular/components/badges/) design and added new examples
- Improved [popovers](https://mdbootstrap.com/docs/angular/components/popovers/) and [popconfirm](https://mdbootstrap.com/docs/angular/components/popconfirm/) design
- Removed default configuration of `chartjs-plugin-datalabels` from [charts](https://mdbootstrap.com/docs/angular/data/charts/), all plugins must be now registered before use

### Fixes and improvements:

- Resolved problem with [scrollbar](https://mdbootstrap.com/docs/angular/methods/scrollbar/) initialization on element with a `mdbScrollbar` directive
- Removed unnecessary border animation on initialization of `mdb-form-control` component
- Resolved problem with global registration of controllers and plugins in [charts](https://mdbootstrap.com/docs/angular/data/charts/)
- Improved types in `mdbChart` directive inputs
- Added some fixes to the [transfer plugin](https://mdbootstrap.com/docs/angular/plugins/transfer/)
  - Improved 'select all' option implementation
  - Resolved problems with value updates in search bar input
  - Resolved problems with component view updates when using pagination
- Improved theme styles in the following components:
  - List group
  - Pagination
  - Datepicker

### New:

- Addew new [color picker plugin](https://mdbootstrap.com/docs/angular/plugins/color-picker/) plugin
- Addew new [multi item carousel plugin](https://mdbootstrap.com/docs/angular/plugins/multi-item-carousel/)
- Addew new [ecommerce gallery plugin](https://mdbootstrap.com/docs/angular/plugins/ecommerce-gallery/)
- Addew new `[borderless]` input to [accordion](https://mdbootstrap.com/docs/angular/components/accordion/)
- Added new `[withPush]` input to [dropdown](https://mdbootstrap.com/docs/angular/components/dropdown/)
- Added new `[plugins]` input to [charts](https://mdbootstrap.com/docs/angular/data/charts/)
- Added public access to the chart instance in `mdbChart` directive
- Added new `[ofText]` input to [datatables](https://mdbootstrap.com/docs/angular/data/datatables/)
- Added new `[titleSource]` and `[titleTarget]` inputs to [transfer plugin](https://mdbootstrap.com/docs/angular/plugins/transfer/)

---

## 3.0.1 (05.12.2022)

### Fixes and improvements:

- [Timepicker](https://mdbootstrap.com/docs/angular/forms/timepicker/)
  - Removed border styles displayed on focused elements
  - Resolved problems with keyboard navigation
- It will be now possible to jump to any step in [linear stepper](https://mdbootstrap.com/docs/angular/components/stepper/#section-linear-stepper-example/), as long as all previous steps are completed
- Resolved problems with `acceptedExtensions` in [file upload plugin](https://mdbootstrap.com/docs/angular/plugins/file-upload/)
- Select all option will now select/deselect only filtered options when used inside a [select component with filter](https://mdbootstrap.com/docs/angular/forms/select/#section-search/)
- Events `itemShown` and `itemHidden` in [accordion](https://mdbootstrap.com/docs/angular/components/accordion/) will be now correctly emitted after animation end
- Resolved problem with close animation in [popconfirm](https://mdbootstrap.com/docs/angular/components/popconfirm/)
- Resolved problem with value returned to [autocomplete](https://mdbootstrap.com/docs/angular/forms/autocomplete/) form control on option selection
- Resolved problem with wrong page value returned by `(paginationChange)` event in [datatable](https://mdbootstrap.com/docs/angular/data/datatables/)
- Increased backdrop z-index in [onboarding plugin](https://mdbootstrap.com/docs/angular/plugins/onboarding/)
- Resolved problem with `autohide` option in [toast](https://mdbootstrap.com/docs/angular/components/toasts/), notification will be removed only if it is not hovered
- Added default padding to the content container in [WYSIWYG editor plugin](https://mdbootstrap.com/docs/angular/plugins/wysiwyg-editor/)
- Resolved problem with Angular dependencies versions in schematics installation

### New:

- Addew new [color picker plugin](https://mdbootstrap.com/docs/angular/plugins/color-picker/)
- Addew new [scroll status plugin](https://mdbootstrap.com/docs/angular/plugins/scroll-status/)

---

## 3.0.0 (10.10.2022)

This version requires Angular v14 and Node 14.15.0 (or later). Follow the [Angular update guide](https://update.angular.io/?l=3&v=13.0-14.0) to migrate your project to Angular 14:

### Breaking changes:

- Added support for Angular 14, this Angular version is now required,
- Removed `~` from styles imports, this syntax is now deprecated
- Updated [calendar](https://mdbootstrap.com/docs/angular/plugins/calendar/) plugin:
  - redesigned toolbar, events, views and modals
  - replaced view toggle buttons with select
  - created an `Add event` button
  - added [blur](https://mdbootstrap.com/docs/angular/plugins/calendar/#section-blur/) option to style past events
  - improved long events styling
  - improved responsiveness
- Design changes:
  - Changed shadows for components such as [card](https://mdbootstrap.com/docs/angular/components/cards/), [popover](https://mdbootstrap.com/docs/angular/components/popovers/), [toast](https://mdbootstrap.com/docs/angular/components/toasts/), [modal](https://mdbootstrap.com/docs/angular/components/modal/), [image hoverable](https://mdbootstrap.com/docs/angular/content-styles/images/), [dropdown menu](https://mdbootstrap.com/docs/angular/components/dropdowns/), [popconfirm](https://mdbootstrap.com/docs/angular/components/popconfirm/)
  - Changed styling of border for [card](https://mdbootstrap.com/docs/angular/components/cards/), [modal](https://mdbootstrap.com/docs/angular/components/modal/), header and footer
  - Changed [table](https://mdbootstrap.com/docs/angular/data/tables/) font weight and text color
  - Changed [checkbox](https://mdbootstrap.com/docs/angular/forms/checkbox/) and [radio](https://mdbootstrap.com/docs/angular/forms/radio/) border color
  - Changed [switch](https://mdbootstrap.com/docs/angular/forms/switch/) background color
  - Changed [checkbox](https://mdbootstrap.com/docs/angular/forms/checkbox/) border radius size
  - Changed [list group](https://mdbootstrap.com/docs/angular/components/list-group/), [pagination](https://mdbootstrap.com/docs/angular/navigation/pagination/) and [dropdown](https://mdbootstrap.com/docs/angular/components/dropdowns/) text color as it is in the body
  - Changed [toast](https://mdbootstrap.com/docs/angular/components/toasts/) color palette
  - Changed [datatables](https://mdbootstrap.com/docs/angular/data/datatables/) striped and hover background color as it is in the usual table
  - Changed [select](https://mdbootstrap.com/docs/angular/forms/select/) states background colors
  - Changed [sidenav](https://mdbootstrap.com/docs/angular/navigation/sidenav/) icons colors and width of the slim version
  - Added new [toast](https://mdbootstrap.com/docs/angular/components/toasts/) color classes that replaced background color classes. Old: `toast bg-primary`. New: `toast toast-primary`

### Fixes and improvements:

- [Lightbox](https://mdbootstrap.com/docs/angular/components/lightbox/)
  - Resolved problems with zoom
  - Resolved problems with swipe on mobile devices
  - Resolved problem with display of smaller images
  - Fixed image position in fullscreen mode
  - Disabled elements will no longer be displayed inside the component modal
- Fixed problems with `rebuild` method in [charts](https://mdbootstrap.com/docs/angular/data/charts/)
- Replaced hardcoded color values with SCSS variables in [autocomplete](https://mdbootstrap.com/docs/angular/forms/autocomplete/) and [select](https://mdbootstrap.com/docs/angular/forms/select/)
- Resolved problem with [carousel](https://mdbootstrap.com/docs/angular/components/carousel/) animations inside a component with OnPush change detection strategy
- Position of dropdown menus in all components will be now correctly updated on scroll event
- Resolved problem with fade animation in [tabs](https://mdbootstrap.com/docs/angular/components/tabs/)
- Label values in [select](https://mdbootstrap.com/docs/angular/forms/select/) will be now dynamically updated on option label change
- All event listeners in the [WYSIWYG](https://mdbootstrap.com/docs/angular/plugins/wysiwyg-editor/) plugin will be now correctly removed when component is destroyed
- Resolved problem with [input](https://mdbootstrap.com/docs/angular/forms/input-fields/) label position when browser autofill is used

### New:

- Addew new [countdown plugin](https://mdbootstrap.com/docs/angular/plugins/countdown/)</a>
- Addew new [input mask plugin](https://mdbootstrap.com/docs/angular/plugins/input-mask/)
- Addew new [parallax plugin](https://mdbootstrap.com/docs/angular/plugins/parallax/)
- Addew new [multi range component](https://mdbootstrap.com/docs/angular/components/multi-range-slider/)
- Added new `[fade]` input that allow to toggle fade animations in [tabs](https://mdbootstrap.com/docs/angular/components/tabs/)

### Design updates:

- Updated icon colors of basic light navbar and footer with secondary color
- Added new horizontal dividers classes `.hr` and `.hr-blurry`
- Updated styles of vertical divider class `.vr` and add new class `.vr-blurry`
- Added new sidenav with menu categories and class `.sidenav-sm`
- Added new `object-fit` and `object-position` utilities

### Removed:

- Deprecated button close classes. Old: `.close`. New: `.btn-close` and `.btn-close-white`
- Deprecated embed classes. Old: `.embed`. New: `.ratio`
- Deprecated flag classes. Check [flags](https://mdbootstrap.com/docs/angular/content-styles/flags/) docs
- Deprecated utils

### Deprecated:

- `.divider-horizontal` and `.divider-horizontal-blurry`
- `.divider-vertical` and `.divider-vertical-blurry`

---

## 2.3.0 (27.06.2022)

### Fixes and improvements

- [Sidenav](https://mdbootstrap.com/docs/b5/angular/navigation/sidenav/)
  - Resolved problems with arrow position updates in slim mode and accordion mode
  - Resolved problem with initialization of component with `[right]="true"` and `[hidden]="false"` options
  - Fixed problem with long content display in component with `[right]="true"` option
- Fixed problems with long label positioning in [checkbox](https://mdbootstrap.com/docs/b5/angular/forms/checkbox/), [switch](https://mdbootstrap.com/docs/b5/angular/forms/switch/) and [radio](https://mdbootstrap.com/docs/b5/angular/forms/radio/)
- Resolved problem with multiple `paginationChange` events emitted on [datatable](https://mdbootstrap.com/docs/b5/angular/data/datatables/) initialization
- Resolved problems with [pagination](https://mdbootstrap.com/docs/b5/angular/navigation/pagination/) and [accordion](https://mdbootstrap.com/docs/b5/angular/components/accordion/) styles when using [theme](https://mdbootstrap.com/docs/b5/angular/content-styles/theme/)
- Fixed problem with max file quantity in [file upload](https://mdbootstrap.com/docs/b5/angular/plugins/file-upload/) plugin with `multiple` mode
- Resolved problem with first option highlight in [select](https://mdbootstrap.com/docs/b5/angular/forms/select/) with a `[highlightFirst]="false"` option
- Added `type="button"` to the 'insert horizontal line' button in [WYSIWYG](https://mdbootstrap.com/docs/b5/angular/plugins/wysiwyg-editor/) to resolve problem with form submit
- Zero-length [tooltip](https://mdbootstrap.com/docs/b5/angular/components/tooltips/) and [popover](https://mdbootstrap.com/docs/b5/angular/components/popovers/) will no longer be displayed
- Fixed problem with multiple `(selected)` events emitted after click on [autocomplete](https://mdbootstrap.com/docs/b5/angular/forms/autocomplete/) option

### New

- Addew new [onboarding plugin](https://mdbootstrap.com/docs/b5/angular/plugins/onboarding/)
- [Stepper](https://mdbootstrap.com/docs/b5/angular/components/stepper/)
  - Added possibility to block step navigation on step header click
  - Added possibility to edit buttons and header text in mobile mode
- Added new `--mdb-bg-opacity` CSS variable
- Added optional auto select on tab-out in [select](https://mdbootstrap.com/docs/b5/angular/forms/select/) and [autocomplete](https://mdbootstrap.com/docs/b5/angular/forms/autocomplete/)
- Added list group new variant with `.list-group-light` class
- Added `.table-group-divider` and `.table-divider-color` classes to emphasize the separation of thead from tbody
- Added new `.divider-horizontal`, `.divider-vertical`, `.divider-horizontal-blurry` and `.divider-vertical-blurry` classes

---

## 2.2.0 (16.05.2022)

### Fixes and improvements:

- Datepicker - resolved problem with returned month value when `m` format is used,
- Treeview - resolved problem with `(selected)` event emit when selecting checkbox,
- Select - resolved problem with keyboard navigation and option highlight after filter input is used.
- Charts - resolved problem with chart options being overriden by options defined for other charts,
- Range - resolved problem with thumb position update after change in `ngModel` or `formControl`

### New:

- [Added filter plugin](https://mdbootstrap.com/docs/b5/angular/plugins/filters/)
- Dropdown - added keyboard navigation

---

## 2.1.0 (11.04.2022)

### Fixes and improvements:

- Datepicker - resolved problem with validation of date typed into input,
- Sidenav - removed unnecessary transition animation on initialization in slim mode,
- File upload plugin - fixed typo in main error message,
- Carousel/Lightbox - updated icons styles for Font Awesome v6.

### New:

- [Cookies management](https://mdbootstrap.com/docs/b5/angular/plugins/cookies-management/)
- [Storage management](https://mdbootstrap.com/docs/b5/angular/plugins/storage-management/)
- [Mention](https://mdbootstrap.com/docs/b5/angular/plugins/mention/)
- [Transfer](https://mdbootstrap.com/docs/b5/angular/plugins/transfer/)

---

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
