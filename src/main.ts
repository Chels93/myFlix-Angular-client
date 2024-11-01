import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Ensure routes are defined in this file
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide the router with defined routes
    provideHttpClient(withFetch()), // Use HTTP client with fetch
    provideAnimations() // Include animations
  ]
}).catch(err => console.error(err));
