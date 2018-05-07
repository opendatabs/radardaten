import {ApplicationRef, Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {control, divIcon, LatLng, latLng, Layer, Map, marker, Marker, tileLayer} from "leaflet";
import layers = control.layers;

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

export class SelectCoordinatesComponent implements OnInit {

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
  ) {
  }

  ngOnInit(): void {
    this.status = Status.initial;
  }

  open(content) {
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
    // implement submit function here
    let str = this.coordinates.toString() + "\n" +
      this.direction1.toString() + "\n" +
      this.direction2.toString();
    alert(str);
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
