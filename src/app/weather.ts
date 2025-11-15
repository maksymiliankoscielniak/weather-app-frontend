import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    if (window.location.hostname === 'localhost') {
      this.apiUrl = 'http://localhost:5000/api';
    } else {
      this.apiUrl = 'https://weather-app-backend-wy11.onrender.com/api';
    }
  }

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}/weather?city=${city}`;
    return this.http.get(url);
  }

  getCitySuggestions(query: string): Observable<any[]> {
    const url = `${this.apiUrl}/cities?query=${query}`;
    return this.http.get<any[]>(url);
  }
}
