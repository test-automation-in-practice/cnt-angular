import { Component } from '@angular/core';
import { DEFINED_ROUTES } from './routes';

@Component({
  selector: 'cntws-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  routes = DEFINED_ROUTES;
}
