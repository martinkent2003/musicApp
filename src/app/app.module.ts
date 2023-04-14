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
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';

// Import application routing module
import { AppRoutingModule } from './app-routing.module';
import { LandingComponent } from './landing/landing.component';

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
  declarations: [AppComponent, LandingComponent, MainComponent, AboutComponent],
  // Declare the services used by the module
  providers: [],
  // Declare the root component that will be used to bootstrap the application
  bootstrap: [AppComponent],
})
export class AppModule {}
