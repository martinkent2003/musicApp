// Import necessary modules from Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Import application components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

// Import application routing module
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  // Declare the imports used by the module
  imports: [
    BrowserModule, // Provides the browser platform support required by Angular
    CommonModule, // Contains commonly needed directives and pipes
    FormsModule, // Provides support for template-driven forms
    RouterModule, // Provides the routing functionality
    HttpClientModule, // Provides HTTP client support
    ReactiveFormsModule, // Provides support for reactive forms
    AppRoutingModule, // Contains the defined routes for the application (must be imported after RouterModule)
  ],
  // Declare the components that belong to the module
  declarations: [AppComponent, LoginComponent, HomeComponent],
  // Declare the services used by the module
  providers: [],
  // Declare the root component that will be used to bootstrap the application
  bootstrap: [AppComponent],
})
export class AppModule {}
