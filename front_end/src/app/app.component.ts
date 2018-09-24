import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Geschwindigkeitserhebungen des Kantons Basel-Stadt';
  firstDisplay = false; // TODO: Change after development
  @ViewChild('content') content: ElementRef;

  constructor(
    private modalService: NgbModal
  ) { }

  ngAfterViewInit(): void {
    if (this.firstDisplay) {
      // setTimeout necessary to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout( () => {
        this.modalService.open(this.content, {size: 'lg'});
        this.firstDisplay = false;
      });
    }
  }

  openLg(content): void {
    this.modalService.open(content, { size: 'lg' , windowClass: 'animated slideInUp' });
  }
}
