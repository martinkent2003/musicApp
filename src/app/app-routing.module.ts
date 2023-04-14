// import necessary modules from Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import the components that will be used for routing
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';

// Define the routes for the application
const routes: Routes = [
  // Default route, redirects to '/landing' when the app loads
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  // Route for the landing page
  { path: 'landing', component: LandingComponent },
  // Route for the main page
  { path: 'main', component: MainComponent },
  // Route for the about page
  { path: 'about', component: AboutComponent },
];

@NgModule({
  // Import the RouterModule with the defined routes
  imports: [RouterModule.forRoot(routes)],
  // Export the RouterModule so other modules can use it
  exports: [RouterModule],
})
export class AppRoutingModule {}
