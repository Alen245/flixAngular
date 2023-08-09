import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component'; // Import your movie-dialog component
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit { // Add 'implements OnInit'

  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog // Inject MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
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
}
