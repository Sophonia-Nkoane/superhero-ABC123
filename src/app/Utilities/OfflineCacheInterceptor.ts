import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NetworkStatusService } from '../services/network-status.service';
import { CacheService } from '../services/cache.service';


export const offlineCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const networkStatusService = inject(NetworkStatusService);
  const cacheService = inject(CacheService);

  if (networkStatusService.isOnline()) {
    return next(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          cacheService.setItem(req.url, event.body);
        }
      })
    );
  } else {
    const cachedResponse = cacheService.getItem(req.url);
    if (cachedResponse) {
      return of(new HttpResponse({ body: cachedResponse, status: 200 }));
    }
    // Handle case when no cached data is available
    return of(new HttpResponse({ body: null, status: 504 }));
  }
};
