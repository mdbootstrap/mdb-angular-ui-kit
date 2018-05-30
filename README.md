[![Angular-Bootstrap-with-Material-Design](https://mdbootstrap.com/img/Marketing/free/main/angular/mdb-angular-free.jpg)](https://mdbootstrap.com/angular/)

# Angular Bootstrap with Material Design

[![npm version](https://badge.fury.io/js/angular-bootstrap-md.svg)](https://badge.fury.io/js/angular-bootstrap-md)

Built with Angular 6, Bootstrap 4 and TypeScript. CLI version available. Absolutely no jQuery.

400+ material UI elements, 600+ material icons, 74 CSS animations, TypeScript modules, SASS files and many more.

All fully responsive. All compatible with different browsers.

__________

# Demo:  
**Main demo**: https://mdbootstrap.com/angular/components/

# Version:
- Angular CLI 6
- Angular 6

# Quick start
- Clone following repo:  
```javascript
git clone https://github.com/mdbootstrap/Angular-Bootstrap-with-Material-Design.git .
``` 
note "." at the end. It will clone files directly into current folder. 
- Run `npm i`
- Run `npm start`
- Voilà! Open browser and visit http://localhost:4200 

Now you can navigate to our documentation (http://mdbootstrap.com/angular/), pick any component and place within your project.

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

# How to install MDB via npm:
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
- in angular-cli.json change:

`"styleExt": "css"` to `"styleExt": "scss"`

rename /src/styles.css to styles.scss

- if you want to change styles in exisiting project you can use `ng set defaults.styleExt scss`

- add below lines to angular-cli.json: 
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

## Getting started:

http://mdbootstrap.com/angular/getting-started/

**5min Quick Start**: https://mdbootstrap.com/angular/5min-quickstart/

# Additional tutorials:

**MDB - Bootstrap tutorial**: https://mdbootstrap.com/bootstrap-tutorial/

**MDB - Wordpress tutorial**: https://mdbootstrap.com/wordpress-tutorial/

# PRO version:

**Angular Bootstrap with Material Design PRO (from $79)**: https://mdbootstrap.com/product/angular-bootstrap-pro/  

## Documentation:
**Huge, detailed documentation avilable online on**: http://mdbootstrap.com/angular/

# Highlights:  
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

**Angular 6**  
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


A big **thank you to all our users** who are working with us to improve the software. We wouldn't be where we are without you. 


# Useful Links:  

Getting started: https://mdbootstrap.com/angular-bootstrap-getting-started/  

5 min quick start: https://mdbootstrap.com/angular/5min-quickstart/  

Material Design + Bootstrap Tutorial: https://mdbootstrap.com/bootstrap-tutorial/  

Material Design + WordPress Tutorial: https://mdbootstrap.com/wordpress-tutorial/  

Freebies: https://mdbootstrap.com/freebies/  

Premium Templates: https://mdbootstrap.com/templates/  

Changelog: https://mdbootstrap.com/angular/changelog/

# Social Media:  

Twitter: https://twitter.com/MDBootstrap  

Facebook: https://www.facebook.com/mdbootstrap  

Pinterest: https://pl.pinterest.com/mdbootstrap 

Google+: https://plus.google.com/u/0/b/107863090883699620484/+Mdbootstrap/posts  

Dribbble: https://dribbble.com/mdbootstrap

LinkedIn: https://www.linkedin.com/company/material-design-for-bootstrap

## Contact:
office@mdbootstrap.com
