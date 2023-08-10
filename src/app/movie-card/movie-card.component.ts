import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component'; // Import your movie-dialog component
declare var $: any; 

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit { // Add 'implements OnInit'

  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }
  
  adjustImageSize(event: any) {
    const imageId = event.target.id;
    $('#' + imageId).parent().css('height', $('#' + imageId).width() * 1.5 + 'px');
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
  addFavorite(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((Response: any) => {
      this.snackBar.open('added to favorites', 'OK', {
        duration: 2000
      })
    })
  }

  isFavorite(id: string): boolean {
    return this.fetchApiData.isFavoriteMovie(id)
  }

  removeFavorite(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((Response: any) => {
      this.snackBar.open('removed to favorites', 'OK', {
        duration: 2000
      })
    })
  }
}
