import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// TODO: migrate me to a shared module
@Component({
  selector: 'cntws-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class LoadingComponent {}
