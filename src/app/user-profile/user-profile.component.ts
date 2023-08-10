import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfile: any = {};
  editingMode: boolean = false;

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.fetchApiData.getOneUser().subscribe((response) => {
      this.userProfile = response;
    });
  }

  enableEditingMode(): void {
    this.editingMode = true;
  }

  updateUserProfile(): void {
    this.fetchApiData.editUser(this.userProfile).subscribe((response) => {
      console.log('Profile updated:', response);
      this.editingMode = false;
    });
  }

  cancelEditing(): void {
    this.editingMode = false;
  }

  goBackToMovies(): void {
    this.router.navigate(['/movies']);
  }

  openDialog(dialogType: string, data: any): void {
    let dialogRef;
    if (dialogType === 'details') {
      dialogRef = this.dialog.open(MovieDialogComponent, {
        data: { movie: data }
      });
    }
  }
}
