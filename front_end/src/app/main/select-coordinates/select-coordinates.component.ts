import {ApplicationRef, Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {control, divIcon, LatLng, latLng, Layer, Map, marker, Marker, tileLayer} from "leaflet";
import layers = control.layers;
import { ViewCell} from 'ng2-smart-table';
import { RadarService } from '../../shared/radar.service';

enum Status {
  initial = 1,
  direction1,
  direction2,
  finished
}

@Component({
  selector: 'app-select-coordinates',
  templateUrl: './select-coordinates.component.html',
  styleUrls: ['./select-coordinates.component.css']
})

export class SelectCoordinatesComponent implements OnInit, ViewCell {
  @Input() rowData: any;
  @Input() value: string | number;
  @Output() open: EventEmitter<any> = new EventEmitter();

  closeResult: string;
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 13,
    center: latLng(47.55814, 7.58769)
  };
  map: Map;
  coordinates: LatLng = new LatLng(0,0);
  direction1: LatLng;
  direction2: LatLng;
  status: Status;
  markers: Layer[] = [];
  Status = Status; // copy class to local reference

  constructor(private modalService: NgbModal,
              private ref: ApplicationRef,
              private radarService: RadarService
  ) {
  }

  ngOnInit(): void {
    this.status = Status.initial;
  }

  onOpen(content) {
    console.log(this.rowData); //TODO remove
    this.modalService.open(content, { windowClass: 'big-modal' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.setMaxBounds(this.map.getBounds());
    this.map.setMinZoom(13);
    this.map.on('contextmenu', (m:any) => {
      this.addCoordinates(m.latlng);
    })
  }

  addCoordinates(latLng: LatLng) {
    if (this.status === Status.finished)
      return null;

    let color: string;
    switch (this.status) {
      case Status.initial:
        color = "red";
        this.coordinates = latLng;
        break;
      case Status.direction1:
        color = "blue";
        this.direction1 = latLng;
        break;
      case Status.direction2:
        color = "green";
        this.direction2 = latLng;
        break;
    }
    let i = divIcon({html: "<svg width='15' height='15' class='svg-marker'>" +
      "<circle cx='5' cy='5' fill='"+color+"' class='circle'></circle>" +
      "</svg>"});
    let mark: Marker = marker(latLng, {
      icon: i
    });
    this.markers.push(mark);

    this.status++;
    // manually trigger angular changeDetection, because action is called from leaflet
    this.ref.tick();
  }

  deleteEntries() {
    this.coordinates = null;
    this.direction1 = null;
    this.direction2 = null;
    this.status = 1;
    this.markers = [];
  }

  submit() {
    // TODO no refresh after submit!
    let str = this.coordinates.toString() + "\n" +
      this.direction1.toString() + "\n" +
      this.direction2.toString();
    console.log(str);
    this.rowData.lat = 0;
    this.rowData.long = 0;
    this.rowData.directionLat = 0;
    this.rowData.directionLong = 0;
    this.radarService.updateRadar(this.rowData);
    this.open.emit(this.rowData); // <-- TODO needed to update component data? Evt. remove
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}