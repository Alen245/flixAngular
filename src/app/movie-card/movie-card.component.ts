import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component'; // Import your movie-dialog component

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit { // Add 'implements OnInit'

  movies: any[] = [];
  favorites: any[] = []; 

  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog // Inject MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites(); 
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
    });
  }

  openDialog(dialogType: string, data: any): void {
    let dialogRef;
    if (dialogType === 'genre') {
      dialogRef = this.dialog.open(MovieDialogComponent, {
        data: { movie: data.Genre }
      });
    } else if (dialogType === 'director') {
      dialogRef = this.dialog.open(MovieDialogComponent, {
        data: { movie: data.Director }
      });
    } else if (dialogType === 'details') {
      dialogRef = this.dialog.open(MovieDialogComponent, {
        data: { movie: data }
      });
    }
  }

  addToFavorites(movie: any): void {
    this.fetchApiData.addFavoriteMovie(movie._id).subscribe((response) => {
      console.log('Added to favorites:', response);
      this.getFavorites(); // Refresh the favorite movies list
    });
  }

  // Method to check if a movie is already in favorites
  isFavoriteMovie(movieId: string): boolean {
    return this.favorites.some((favorite) => favorite._id === movieId);
  }

  // Method to get favorite movies
  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((response) => {
      this.favorites = response;
    });
  }
  
}
