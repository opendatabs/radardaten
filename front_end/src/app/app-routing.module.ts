import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './main/map-view/map-view.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'karte', pathMatch: 'full' },
  { path: 'karte', component: MapViewComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: MapViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
