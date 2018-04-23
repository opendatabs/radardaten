import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {MapViewComponent} from "./main/map-view/map-view.component";

const routes: Routes = [
  { path: '', redirectTo: 'mapView', pathMatch: 'full' },
  { path: 'home', component: MainComponent },
  { path: 'mapView', component: MapViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
