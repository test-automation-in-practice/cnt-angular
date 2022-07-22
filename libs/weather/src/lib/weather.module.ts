import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationComponent } from './components/location/location.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { WeatherResultsComponent } from './components/result/weather-results.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatDividerModule],
  declarations: [LocationComponent, WeatherResultsComponent],
  exports: [LocationComponent, WeatherResultsComponent],
})
export class WeatherModule {}
