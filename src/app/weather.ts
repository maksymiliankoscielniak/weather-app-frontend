import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const url = `http://localhost:5000/api/weather?city=${city}`;
    return this.http.get(url);
  }

  getCitySuggestions(query: string): Observable<any[]> {
    const url = `http://localhost:5000/api/cities?query=${query}`;
    return this.http.get<any[]>(url);
  }
}
