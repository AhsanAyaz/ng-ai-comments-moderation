import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NGGC_API_CONFIG, NgGCConfig } from '@codewithahsan/ng-gc';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: NGGC_API_CONFIG,
      useValue: {
        model: 'gemini-1.5-flash',
        apiKey: 'YOUR_GEMINI_KEY',
        debug: true, // (optional): enables console log of gemini response
      } as NgGCConfig,
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
