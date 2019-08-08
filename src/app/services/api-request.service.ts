import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let apiUrl: string = 'http://localhost:5000'; 

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(private http: HttpClient) { }

  loadPlaces(features: object) {
    let places = this.http.post<object>(apiUrl, features);
    return places;
  }
}