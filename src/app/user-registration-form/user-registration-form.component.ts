// Import necessary components and modules from Angular
import { Component, OnInit, Input } from '@angular/core';

// Import MatDialogRef to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// Import the API service for making API calls
import { FetchApiDataService } from '../fetch-api-data.service';

// Import MatSnackBar for displaying notifications to the user
import { MatSnackBar } from '@angular/material/snack-bar';

// Component decorator: defines the selector, template, and styles for the component
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
// Implement the OnInit interface to handle initialization
export class UserRegistrationFormComponent implements OnInit {

  // Input decorator: allows parent component to bind data to this component
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  // Constructor: injects necessary services
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  // ngOnInit lifecycle hook: runs when the component is initialized
  ngOnInit(): void {
    // Logic to be executed during initialization
  }

  // Function to register a new user
  registerUser(): void {
    // Call userRegistration method from fetchApiData service to send user data
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      // Logic for a successful user registration goes here! (To be implemented)
      this.dialogRef.close(); // Close the modal on success
      // Open a snackbar notification with a success message
      this.snackBar.open(result, 'OK', {
        duration: 2000 // Display for 2 seconds
      });
    }, (result) => {
      // Open a snackbar notification with an error message
      this.snackBar.open(result, 'OK', {
        duration: 2000 // Display for 2 seconds
      });
    });
  }
}
