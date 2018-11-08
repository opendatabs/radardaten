import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MapViewComponent } from './main/map-view/map-view.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'karte', pathMatch: 'full' },
  { path: 'home', component: MainComponent },
  { path: 'karte', component: MapViewComponent }, // TODO: Change to Main component
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: MapViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
