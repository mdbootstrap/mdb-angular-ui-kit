import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataSubmitComponent } from './components/data-submit/data-submit.component';
import { DataVisualizeComponent } from './components/data-visualize/data-visualize.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  {path:  '', pathMatch:  'full', redirectTo:  'home'},
  {path: 'home', component: HomeComponent},
  {path: 'data-submit', component: DataSubmitComponent},
  {path: 'data-visualize', component: DataVisualizeComponent},
  {path: 'log-in', component: LogInComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'contact', component: ContactComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
