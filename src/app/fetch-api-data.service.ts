import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Define the ApiError interface
interface ApiError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

// Ensure the API URL ends with a '/'
const apiUrl = 'https://mymoviesdb-6c5720b5bef1.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) {}

  public userRegistration(userDetails: any): Observable<any> {
    console.log('User Registration Data:', userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    console.log('User Login Data:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';

    // Client-side error
    if (error.error instanceof ErrorEvent) {
      console.error('A client-side or network error occurred:', error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } 
    // Server-side error
    else {
      console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
      errorMessage = `Backend returned code ${error.status}: ${error.error.message || 'No additional error message'}`;

      // Specific handling for status code 0 (network issues, CORS)
      if (error.status === 0) {
        errorMessage = 'Network error or CORS issue. Please ensure the server is running and accessible.';
      }

      // Handle detailed API validation errors if available
      if (error.error && Array.isArray(error.error.errors)) {
        const apiErrors: ApiError[] = error.error.errors;
        errorMessage = apiErrors.map((err: ApiError) => `${err.path}: ${err.msg}`).join(', ');
      }
    }

    // Always log the error and return an observable with the error message
    return throwError(errorMessage);
  }

  private extractResponseData(res: any): any {
    return res || {};
  }
}
