import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//typescript version
// import { MDBBootstrapModule } from './typescripts/angular-bootstrap-md/free';
// import { AgmCoreModule } from './typescripts/angular-bootstrap-md/free/angular2-google-maps/ts/core';

//compiled npm
import { MDBBootstrapModule } from 'angular-bootstrap-md/';
import { AgmCoreModule } from 'angular-bootstrap-md/angular2-google-maps/ts/core/';

//compiled local js
// import { MDBBootstrapModule } from './angular-bootstrap-md/free';
// import { AgmCoreModule } from './angular-bootstrap-md/free/angular2-google-maps/ts/core/';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'you_api_key'
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
