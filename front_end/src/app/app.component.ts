import { OnInit, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SailsService } from 'angular2-sails';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Geschwindigkeitserhebungen des Kantons Basel-Stadt';
  firstDisplay = true;
  @ViewChild('content') content: ElementRef;

  constructor(
    private _sailsService: SailsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    // Init Sails service and request CSRF Token and check login
    const opts = {
      url: environment.api,
      transports: ['websocket'],
      reconnection: true
    };
    this._sailsService.connect(opts);
  }

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
