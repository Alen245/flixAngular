import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfile: any = {};
  editingMode: boolean = false;
  favorites: any[] = [];

  constructor(private fetchApiData: FetchApiDataService,
    private router: Router ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
    this.getFavorites();
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
  getFavorites(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((response) => {
      this.favorites = response;
    });
  }
  goBackToMovies(): void {
    this.router.navigate(['/movies']); // Navigate to the movies view
  }
}
