import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideEchartsCore } from 'ngx-echarts';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primeuix/themes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// const MyPreset = definePreset(Lara, {
//     semantic: {
//         colorScheme: {
//             light: {
//                 //...
//             },
//             dark: {
//                 background: '#FFFFFF',
//                 color: 
//             }
//         }
//     }
// });

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideEchartsCore({
      echarts: () => import('echarts'),
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        // options: {
        //     darkModeSelector: '.my-app-dark'
        // }
      },
    }),
  ],
};
