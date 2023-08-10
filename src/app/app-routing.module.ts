// Importing necessary modules from Angular's core and router libraries.
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importing custom components that will be associated with particular routes.
import { MovieCardComponent } from './movie-card/movie-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component'; 

// Defining the application's routing rules.
const routes: Routes = [
  // If the path is empty, redirect to 'welcome'. 
  // The 'pathMatch: full' means the entire URL path needs to match.
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  
  // Associating the path 'movies' with the MovieCardComponent.
  { path: 'movies', component: MovieCardComponent },
  
  // Associating the path 'user-profile' with the UserProfileComponent.
  { path: 'user-profile', component: UserProfileComponent },
];

// The @NgModule decorator is used to define this class as a module.
@NgModule({
  // The RouterModule.forRoot method is used to supply the route configuration to the Angular router.
  imports: [RouterModule.forRoot(routes)],
  
  // This makes RouterModule directives available to the module that imports this AppRoutingModule.
  exports: [RouterModule]
})

// Defining the AppRoutingModule class.
export class AppRoutingModule { }
