import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Geschwindigkeitserhebungen des Kantons Basel-Stadt';
  firstDisplay: boolean = true;
  @ViewChild('content') content: ElementRef;

  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.firstDisplay) {
      this.modalService.open(this.content, {size: 'lg'});
      this.firstDisplay = false;
    }
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' , windowClass: 'animated slideInUp' });
  }
}
