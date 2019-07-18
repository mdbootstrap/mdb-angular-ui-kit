<p align="center">
  <a href="https://mdbootstrap.com/docs/angular/">
    <img width="500" src="https://mdbootstrap.com/img/Marketing/general/logo/huge/mdb-angular.png">
  </a>
</p>

<h1 align="center">Angular Bootstrap with Material Design</h1>

<p align="center">
  Built with <b>Angular 8, Bootstrap 4 and TypeScript</b>. CLI version available. Absolutely no jQuery.
</p>
<p align="center">
  <b>400+</b> material UI elements, <b>600+</b> material icons, <b>74</b> CSS animations, TypeScript modules, SASS files and many more.
</p>
<p align="center">
  All fully responsive. All compatible with different browsers.
</p>

<p align="center">
  <a href="https://npmcharts.com/compare/angular-bootstrap-md?minimal=true"><img src="https://img.shields.io/npm/dm/angular-bootstrap-md.svg" alt="Downloads"></a>
  <a href="https://github.com/mdbootstrap/Angular-Bootstrap-with-Material-Design/blob/master/license.pdf"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  <a href="https://badge.fury.io/js/angular-bootstrap-md"><img src="https://badge.fury.io/js/angular-bootstrap-md.svg" alt="npm"></a>
  <a href="https://twitter.com/intent/tweet/?text=Thanks+@mdbootstrap+for+creating+amazing+and+free+Material+Design+for+Bootstrap+4+UI+KIT%20https://mdbootstrap.com/docs/angular/&hashtags=angular,code,webdesign,bootstrap"><img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"></a>
</p>

<p align="center">
  <a href="https://mdbootstrap.com/docs/angular/" target="_blank">
    <img width="700" src="https://mdbootstrap.com/img/Marketing/products/angular/mdb-free.jpg" alt="logo">
  </a>
</p>

________


# Table of Contents

* [Other Technologies](#other-technologies)
* [Demo](#demo)
* [Version](#version)
* [Quick start](#quick-start)
* [Available commands](#available-commands)
* [Modules list](#modules-list)
* [How to install MDB via npm](#how-to-install-mdb-via-npm)
* [Supported Browsers](#supported-browsers)
* [Contributing](#contributing)
* [Getting started](#getting-started)
* [Additional tutorials](#additional-tutorials)
* [PRO version](#pro-version)
* [Documentation](#documentation)
* [Highlights](#highlights)
* [Useful Links](#useful-links)
* [Social Media](#social-media)

# Other Technologies

[<img src="https://mdbootstrap.com/img/Marketing/general/logo/small/jquery.png"/>](https://mdbootstrap.com/docs/jquery/)[<img src="https://mdbootstrap.com/img/Marketing/general/logo/small/react.png"/>](https://mdbootstrap.com/docs/react/)[<img src="https://mdbootstrap.com/img/Marketing/general/logo/small/vue.png"/>](https://mdbootstrap.com/docs/vue/)

# Demo

[Main demo](https://mdbootstrap.com/docs/angular/components/demo/)

# Version

- Angular 8
- Angular CLI 8

# Quick start

- Clone following repo:
```javascript
git clone https://github.com/mdbootstrap/Angular-Bootstrap-with-Material-Design.git .
```
note "." at the end. It will clone files directly into current folder.
- Run `npm i`
- Run `npm start`
- Voilà! Open browser and visit http://localhost:4200

Now you can navigate to [our documentation](https://mdbootstrap.com/docs/angular/), pick any component and place within your project.

## Demo application

Feel free to check our live example components: Just type `ng serve mdb-demo` in terminal!

Type one of the below commands to remove demo application from this project:
* npm `run remove-demo-unix` to remove demo application on UNIX based systems,
* npm `run remove-demo-windows` to remove demo application on Windows systems.

# Available commands

* npm run build:lib - building library,
* npm run pack - copying assets and packaging /dist directory into .tgz archive
* npm run version - adjusting src/package.json version from main package.json file,
* npm run compile - Executing above commands with correct sequence.

# Modules list

* ButtonsModule,
* CarouselModule,
* ChartsModule,
* CollapseModule,
* InputsModule,
* ModalModule,
* NavbarModule,
* PopoverModule,
* TooltipModule,
* WavesModule,
* MDBBootstrapModule - contains every MDB modules.

# How to install MDB via npm

- create new project `ng new project_name --style=scss`
- `npm i angular-bootstrap-md --save`
- to app.module.ts add
```javascript
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    imports: [
        MDBBootstrapModule.forRoot()
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
});
```
- in angular.json change:

`"styleExt": "css"` to `"styleExt": "scss"`

rename /src/styles.css to styles.scss

- if you want to change styles in exisiting project you can use `ng set defaults.styleExt scss`

- add below lines to angular.json:
```javascript
"styles": [
    "node_modules/font-awesome/scss/font-awesome.scss",
    "node_modules/angular-bootstrap-md/scss/bootstrap/bootstrap.scss",
    "node_modules/angular-bootstrap-md/scss/mdb-free.scss",
    "src/styles.scss"
],
"scripts": [
  "node_modules/chart.js/dist/Chart.js",
  "node_modules/hammerjs/hammer.min.js"
],
```
- install external libs
```bash
npm install -–save chart.js@2.5.0 font-awesome hammerjs
```

### Run server

```bash
ng serve --open
```

# Supported browsers

MDBootstrap supports the **latest, stable releases** of all major browsers and platforms.

Alternative browsers which use the latest version of WebKit, Blink, or Gecko, whether directly or via the platform’s web view API, are not explicitly supported. However, MDBootstrap should (in most cases) display and function correctly in these browsers as well.

### Mobile devices

Generally speaking, MDBootstrap supports the latest versions of each major platform’s default browsers. Note that proxy browsers (such as Opera Mini, Opera Mobile’s Turbo mode, UC Browser Mini, Amazon Silk) are not supported.

|  | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome  | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox  |  [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari   | Android Browser & WebView  |                  [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br> Miscrosoft Edge                      |
|:--------------------:|:---------------------------:|:----------------------------:|:----------------------------:|:----------------------------:|:-------------------------------------------------------------------------:|
| Android | Supported | Supported | N/A | Android v5.0+ supported | Supported |
| iOS | Supported | Supported | Supported | N/A | Supported |
| Windows 10 Mobile | N/A | N/A | N/A | N/A | Supported |

### Desktop browsers

Similarly, the latest versions of most desktop browsers are supported.

|  | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome  |  [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox  | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br> Internet Explorer  |  [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Internet Explorer / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br> Edge  | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera                  |       [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari       |
|:--------------------:|:-----------------------------:|:------------------------------:|:------------------------------:|:----------------------------:|:-------------------------------------------------------------------------:|:------------------------------:|
| Mac | Supported | Supported | N/A | N/A | Supported | Supported |
| Windows  | Supported | Supported | N/A | Supported | Supported | Not supported |


# Contributing

Please read [CONTRIBUTING.md](https://github.com/mdbootstrap/Angular-Bootstrap-with-Material-Design/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

# Getting started

[5min Quick Start](https://mdbootstrap.com/docs/angular/getting-started/quick-start/)

# Additional tutorials

[MDB - Bootstrap tutorial](https://mdbootstrap.com/education/bootstrap/)

[MDB - Wordpress tutorial](https://mdbootstrap.com/education/wordpress/)

# PRO version

[Angular Bootstrap with Material Design PRO](https://mdbootstrap.com/products/angular-ui-kit/)

# Documentation

[Huge, detailed documentation avilable online](http://mdbootstrap.com/docs/angular/)

# Highlights

**Bootstrap 4**
Up-to-date with the latest standards of Bootstrap 4 and all the best it has to offer.

**Angular CLI**
A command line interface handling all the tedious tasks for you out of the box.

**Detailed documentation**
Intuitive and user-friendly documentation, created with a copy-paste approach.

**No jQuery**
Writing you code with pure Angular is now quicker, easier, and cleaner.

**TypeScript**
Superset of JavaScript that compiles to clean JavaScript output.

**Angular 8**
Create smarter and faster Angular apps with the latest official Angular release.

**Cross-browser compatibility**
Works perfectly with Chrome, Firefox, IE, Safari, Opera and Microsoft Edge.

**Frequent updates**
Expect any bugs being fixed in a matter of days.

**Active community**
MDB is broadly used by professionals on multiple levels, who are ready to aid you.

**Modularity**
Use TypeScript modules to compile package adjusted yo your needs.

**Useful helpers**
Reduce the frequency of highly repetitive declarations in your CSS.

**Technical support**
Every day we help our users with their issues and problems.

**SASS files**
Thought-out .scss files come in a compile-ready form.

**Flexbox**
Full support of Flexbox layout system lets you forget about alignment issues.

### Support MDB developers

- Star our GitHub repo
- Create pull requests, submit bugs, suggest new features or documentation updates
- Follow us on [Twitter](https://twitter.com/mdbootstrap)
- Like our page on [Facebook](https://www.facebook.com/mdbootstrap)

A big ❤️ **thank you to all our users** ❤️ who are working with us to improve the software. We wouldn't be where we are without you.


# Useful Links

[Getting started](https://mdbootstrap.com/docs/angular/getting-started/download/)

[5 min quick start](https://mdbootstrap.com/docs/angular/getting-started/quick-start/)

[Material Design + Bootstrap Tutorial](https://mdbootstrap.com/education/bootstrap/)

[Material Design + WordPress Tutorial](https://mdbootstrap.com/education/wordpress/)

[Freebies](https://mdbootstrap.com/freebies/)

[Premium Templates](https://mdbootstrap.com/templates/)

[Changelog](https://mdbootstrap.com/docs/angular/changelog/)

[MDB jQuery repo](https://github.com/mdbootstrap/bootstrap-material-design)

[MDB React repo](https://github.com/mdbootstrap/React-Bootstrap-with-Material-Design)

[MDB Vue repo](https://github.com/mdbootstrap/Vue-Bootstrap-with-Material-Design)

# Social Media

[Twitter](https://twitter.com/MDBootstrap)

[Facebook](https://www.facebook.com/mdbootstrap)

[Pinterest](https://pl.pinterest.com/mdbootstrap)

[Google+](https://plus.google.com/u/0/b/107863090883699620484/+Mdbootstrap/posts)

[Dribbble](https://dribbble.com/mdbootstrap)

[LinkedIn](https://www.linkedin.com/company/material-design-for-bootstrap)

## Contact

contact@mdbootstrap.com
