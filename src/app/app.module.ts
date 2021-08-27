import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MdbModule } from '../../projects/mdb-angular-ui-kit';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
