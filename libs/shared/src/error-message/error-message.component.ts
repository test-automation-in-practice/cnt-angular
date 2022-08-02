import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cntws-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatIconModule],
})
export class ErrorMessageComponent {
  @Input() message!: string;
}
