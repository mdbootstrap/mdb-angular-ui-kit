import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DataSubmitComponent } from './data-submit/data-submit.component';
import { DataVisualizeComponent } from './data-visualize/data-visualize.component';

const routes: Routes = [
  {path:  '', pathMatch:  'full', redirectTo:  'home'},
  {path: 'home', component: HomeComponent},
  {path: 'data-submit', component: DataSubmitComponent},
  {path: 'data-visualize', component: DataVisualizeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
