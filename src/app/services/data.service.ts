import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { BarChartData } from '../models/barchart-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  configUrl='http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getBarChartData() {
    return this.http.get<Array<BarChartData>>(`${this.configUrl}barChart`)
      .pipe(
        catchError(this.handleError)
      );
  }
  getPierChartData() {
    return this.http.get<Array<BarChartData>>(`${this.configUrl}pieChart`)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
