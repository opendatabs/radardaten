import { OnInit, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SailsService } from 'angular2-sails';
import { environment } from '../environments/environment';
import { AuthService } from './shared/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Geschwindigkeitserhebungen des Kantons Basel-Stadt';
  admin: boolean;
  firstDisplay = true; // Should be "true" in production
  @ViewChild('content', {static: true}) content: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _sailsService: SailsService,
    private modalService: NgbModal
  ) {
    router.events.subscribe(() => {
      if (this.router.url.indexOf('login') > -1) {
        this.authService.requestLogin().subscribe(
          event => {
            if (event) {
              this.admin = event;
              this.authService.changeAdminState(this.admin);
            }
          },
          error => console.log(error));
      }
      if (this.router.url.indexOf('admin') > -1) {
        this.firstDisplay = false;
      }
    });
  }

  ngOnInit() {
    // Init Sails service and request CSRF Token and check login
    const opts = {
      url: environment.socketApi,
      transports: ['websocket'],
      reconnection: true
    };
    this._sailsService.connect(opts);
  }

  ngAfterViewInit(): void {
    if (this.firstDisplay) {
      // setTimeout necessary to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout( () => {
        this.modalService.open(this.content, { size: 'lg' });
        this.firstDisplay = false;
      });
    }
  }

  openLg(content): void {
    this.modalService.open(content, { size: 'lg' , windowClass: 'animated slideInUp' });
  }
}
