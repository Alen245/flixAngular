// Necessary Angular imports
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// API base URL
const apiUrl = 'https://moviepi24.herokuapp.com/';

// Service decorator; specifying the service is provided in the root, 
// meaning it's a singleton and accessible throughout the application
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {

  // Constructor with dependency injection for HttpClient
  constructor(private http: HttpClient) {}

  // User registration method
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    // POST request to the API's 'users' endpoint with provided user details
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // User login method
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    // POST request to the API's 'login' endpoint with provided login details
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch all movies method
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    // GET request to the API's 'movies' endpoint with authorization headers
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch single movie by title method
  public getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    // GET request to the API's 'movies' endpoint for a specific movie title with authorization headers
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch single director by name method
  public getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    // GET request to the API's 'movies/director' endpoint for a specific director name with authorization headers
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch single genre by name method
  public getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    // GET request to the API's 'movies/genre' endpoint for a specific genre name with authorization headers
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch current logged-in user details method
  public getOneUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // GET request to the API's 'users' endpoint for the current user with authorization headers
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Fetch favorite movies of the current logged-in user method
  public getFavoriteMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    // GET request to the API's 'users' endpoint for the current user's favorite movies with authorization headers
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

  // Add movie to the favorites list of the current logged-in user method
  public addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));
    // POST request to the API's 'users' endpoint to add the movie to favorites for the current user with authorization headers
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

  // Check if a movie is in the favorites list of the current logged-in user method
  public isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }

  // Update current logged-in user details method
  public editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    // PUT request to the API's 'users' endpoint to update user details with authorization headers
    return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete the current logged-in user method
  public deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    // DELETE request to the API's 'users' endpoint to delete the current user with authorization headers
    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Remove movie from the favorites list of the current logged-in user method
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    console.log(index);
    if (index > -1) {
      user.FavoriteMovies.splice(index, 1);
    }
    localStorage.setItem('user', JSON.stringify(user));
    // DELETE request to the API's 'users' endpoint to remove the movie from favorites for the current user with authorization headers
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