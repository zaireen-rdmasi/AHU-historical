import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class environmentConfig {
  apiEndPoint = 'http://10.10.3.198:8080/api/v1';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const origin = window.location.origin;

      if (origin.startsWith('http://localhost:4200')) {
        this.apiEndPoint = 'http://10.10.3.198:8080/api/v1';
      }
    }
  }
}
