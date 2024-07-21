import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    this.initializeNetworkListeners();
  }

  private initializeNetworkListeners(): void {
    window.addEventListener('online', () => this.online$.next(true));
    window.addEventListener('offline', () => this.online$.next(false));
  }

  getNetworkStatus(): Observable<boolean> {
    return this.online$.asObservable();
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
