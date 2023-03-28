// import necessary modules from Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import the components that will be used for routing
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// define the routes that will be used in the application
const routes: Routes = [
  // redirect to login page by default
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // map the '/login' URL to the LoginComponent
  { path: 'login', component: LoginComponent },
  // map the '/home' URL to the HomeComponent
  { path: 'home', component: HomeComponent },
];

@NgModule({
  // set up the router module with the defined routes
  imports: [RouterModule.forRoot(routes)],
  // export the RouterModule so other modules can use it
  exports: [RouterModule]
})
export class AppRoutingModule { }
