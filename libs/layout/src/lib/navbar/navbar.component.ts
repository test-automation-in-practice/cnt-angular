import { Component, Input } from '@angular/core';
import { NavbarEntry } from '../model/navigation.model';

@Component({
  selector: 'cntws-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() navbarEntries: NavbarEntry[] = [];
}
