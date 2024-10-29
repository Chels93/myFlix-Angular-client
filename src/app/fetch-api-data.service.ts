import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Ensure the API URL ends with a '/'
const apiUrl = 'https://mymoviesdb-6c5720b5bef1.herokuapp.com';

export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private getToken(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : '';
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
        console.error('Some error occurred', error.error.message);
    } else {
        console.error(
            `Error Status code ${error.status}, ` +
            `Error body is: ${error.error}`
        );
    }
    return throwError('An error occurred. Please try again later.');
  }

  public userRegistration(userDetails: any): Observable<any> {
    console.log('User Registration Data:', userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public userLogin(userDetails: any): Observable<any> {
    console.log('User Login Data:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        // Assuming the token is returned in the response
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token in localStorage
        }
        return response;
      }),
      catchError(this.handleError)
    );
  }

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in.');
      return throwError('No token found, please log in.');
    }
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
    if (!token) {
      console.error('No token found, please log in.');
      return throwError('No token found, please log in.');
    }
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private extractResponseData(res: any): any {
    const body = res; 
    return body || { };
  }
}