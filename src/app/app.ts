import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, switchMap, debounceTime, catchError } from 'rxjs/operators';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Weather } from './weather';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatInputModule, MatAutocompleteModule, MatFormFieldModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private weather: Weather) {}

  private errorToastTimer: any;
  isFadingOut = false;

  searchControl = new FormControl('');
  citySuggestions$!: Observable<any[]>;

  weatherData: any = null;
  errorMessage: string = '';

  ngOnInit() {
    this.citySuggestions$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),

      switchMap(value => {
        if (value && value.length > 2) {
          return this.weather.getCitySuggestions(value);
        } else {
          return of([]);
        }
      }),

      catchError(() => {
        return of([]);
      })
    );
  }
  
  onSearch() {
    this.weatherData = null;
    this.errorMessage = '';

    if (this.errorToastTimer) {
      clearTimeout(this.errorToastTimer);
    }

    const city = this.searchControl.value || '';
    this.weather.getWeather(city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.weatherData = null;
        this.errorMessage = err.error.error || 'An unknown error occurred.';

        this.errorToastTimer = setTimeout(() => {
          this.isFadingOut = true;

          setTimeout(() => {
            this.errorMessage = '';
            this.isFadingOut = false;
          }, 500);

        }, 3000);
      }
    });
  }
}
