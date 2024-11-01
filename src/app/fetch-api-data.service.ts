import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Define the ApiError interface for handling detailed errors
interface ApiError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

// API base URL (ensure it ends with '/')
const apiUrl = 'https://mymoviesdb-6c5720b5bef1.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  constructor(private http: HttpClient) {}

  // Register a new user
  public userRegistration(userDetails: any): Observable<any> {
    console.log('User Registration Data:', userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Login user and return auth data
  public userLogin(userDetails: any): Observable<any> {
    console.log('User Login Data:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch all movies (GetAllMoviesService function as requested)
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch a specific movie by title
  public getOneMovie(title: string): Observable<any> {
    const token = this.getToken();
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch current user profile
  public getUserProfile(): Observable<any> {
    const token = this.getToken();
    return this.http.get(apiUrl + 'user/profile', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Update user profile details
  public updateUserProfile(userDetails: any): Observable<any> {
    const token = this.getToken();
    return this.http.put(apiUrl + 'user/profile', userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Utility function to get token from local storage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Error handler for HTTP requests
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side or network error:', error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      console.error(`Backend error: code ${error.status}, body: ${JSON.stringify(error.error)}`);
      errorMessage = `Backend error ${error.status}: ${error.error.message || 'No additional error message'}`;

      if (error.status === 0) {
        errorMessage = 'Network error or CORS issue. Check server accessibility.';
      }

      if (error.error && Array.isArray(error.error.errors)) {
        const apiErrors: ApiError[] = error.error.errors;
        errorMessage = apiErrors.map((err: ApiError) => `${err.path}: ${err.msg}`).join(', ');
      }
    }

    return throwError(errorMessage);
  }

  // Extracts response data or returns an empty object if no data
  private extractResponseData(res: any): any {
    return res || {};
  }
}
