import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {NavbarComponent} from './navbar/navbar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MapComponent} from './main/map/map.component';
import {MapViewComponent} from './main/map-view/map-view.component';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {MapTooltipComponent} from './main/map-tooltip/map-tooltip.component';
import {DataService} from "./shared/data-service.service";
import {HttpClientModule} from "@angular/common/http";
import {ColorService} from "./shared/color.service";
import {MapDetailComponent} from './main/map-detail/map-detail.component';
import {D3graphComponent} from './main/d3graph/d3graph-component';
import {D3Service} from 'd3-ng2-service';
import { AdminComponent } from './admin/admin.component';
import { RadarService } from './shared/radar.service';
import { RecordService } from './shared/record.service';
import { Ng2SmartTableModule } from "ng2-smart-table";
import { SelectCoordinatesComponent } from './main/select-coordinates/select-coordinates.component';
import {FormsModule} from "@angular/forms";
import { AddRecordsBtnComponent } from './admin/utility/add-records-btn.component';
import {CalculatorService} from "./shared/calculator.service";
import { DatepickerComponent } from './admin/utility/datepicker.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {LoadingModalComponent} from "./shared/loading-modal/loading-modal.component";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    MapComponent,
    MapViewComponent,
    MapTooltipComponent,
    MapDetailComponent,
    D3graphComponent,
    AdminComponent,
    SelectCoordinatesComponent,
    AddRecordsBtnComponent,
    DatepickerComponent
    // LoadingModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    LeafletModule.forRoot(),
    HttpClientModule,
    Ng2SmartTableModule,
    FormsModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    DataService,
    HttpClientModule,
    ColorService,
    D3Service,
    RadarService,
    RecordService,
    CalculatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
