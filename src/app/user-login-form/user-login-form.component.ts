import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router'; // Import the Router

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent {
  userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: ''
  };

  constructor(
    private fetchApiDataService: FetchApiDataService,
    private router: Router // Inject the Router
  ) {}

  loginUser(): void {
    this.fetchApiDataService.userLogin(this.userData).subscribe(
      (response) => {
        // Handle successful login here, such as storing the user data and token in localStorage
        console.log('User logged in:', response);
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        // Navigate to the movies route after successful login
        this.router.navigate(['movies']); // Navigate to 'movies' route
      },
      (error) => {
        // Handle login error here
        console.error('Login error:', error);
        // Display an error message to the user
      }
    );
  }
}
