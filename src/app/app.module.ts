import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataSubmitComponent } from './components/data-submit/data-submit.component';
import { DataVisualizeComponent } from './components/data-visualize/data-visualize.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactComponent } from './components/contact/contact.component';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DataSubmitComponent,
    DataVisualizeComponent,
    LogInComponent,
    RegisterComponent,
    ContactComponent
  ],
    imports: [
        BrowserModule,
        MDBBootstrapModule.forRoot(),
        RouterModule,
        FormsModule,
        AppRoutingModule,
        FileUploadModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
