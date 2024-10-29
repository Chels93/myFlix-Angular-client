import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // Use provideAnimations for Angular Material
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient from @angular/common/http

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(), // Ensure this is correct based on your needs
    provideHttpClient() // Corrected import
  ]
};
