// Necessary Angular imports for HTTP services and observables
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Base URL of the API endpoint
const apiUrl = 'http://moviepi24.herokuapp.com/';

/**
 * @class FetchApiDataService
 * Service to interact with the Movie API. 
 * This service is provided as a singleton across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  /**
   * Creates an instance of FetchApiDataService.
   * @param {HttpClient} http - The HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * 
   * @param userDetails - Object containing user details.
   * @returns {Observable<any>} - An observable of the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails); // Log user details (Note: logging user details may pose a security risk in production)
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user
   * @param userDetails - Object containing username and password
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails); // Log user details (Same security note as above)
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all movies
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a movie by its title
   * @param title - Title of the movie
   */
  public getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a director by name
   * @param directorName - Name of the director
   */
  public getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a genre by its name
   * @param genreName - Name of the genre
   */
  public getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves details of the currently logged-in user
   */
  public getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves favorite movies of the currently logged-in user
   */
  public getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to the favorites list of the currently logged-in user
   * @param movieId - ID of the movie to add
   */
  public addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Checks if a movie is in the favorites list of the current user
   * @param movieId - ID of the movie to check
   */
  public isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  /**
   * Updates details of the currently logged-in user
   * @param updatedUser - Object containing updated user details
   */
  public editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Deletes the currently logged-in user from the system
   */
  public deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from the favorites list of the current user
   * @param movieId - ID of the movie to remove
   */
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);  // Log index (Consider removing this for production)
    if (index > -1) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      responseType: "text"
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

 

  // Utility method to extract the data from the API response
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Generic error handling method for HTTP requests
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    }
    else if (error.error.errors) {
      return throwError(() => new Error(error.error.errors[0].msg));
    }
    else {
      console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  
}
