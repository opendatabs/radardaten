import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from "./main/main.component";
import { MapViewComponent } from "./main/map-view/map-view.component";
import { AdminComponent } from "./admin/admin.component";

const routes: Routes = [
  { path: '', redirectTo: 'mapView', pathMatch: 'full' },
  { path: 'home', component: MainComponent },
  { path: 'mapView', component: MapViewComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
