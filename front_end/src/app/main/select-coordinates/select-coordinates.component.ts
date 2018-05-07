import {ChangeDetectorRef, Component, OnInit, TemplateRef} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LatLng, latLng, Map, tileLayer} from "leaflet";

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
  coordinates: LatLng;
  direction1: LatLng;
  direction2: LatLng;
  status: Status;

  constructor(private modalService: NgbModal,
              private cd:ChangeDetectorRef,
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
    debugger;
    switch (this.status) {
      case Status.initial:
        this.coordinates = latLng;
        break;
      case Status.direction1:
        this.direction1 = latLng;
        break;
      case Status.direction2:
        this.direction2 = latLng;
        break;
    }
    this.status++;
    this.cd.detectChanges();
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
