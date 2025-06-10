import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { interval, concat, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.initializeAutoUpdate();
  }

  private initializeAutoUpdate(): void {
    // Check for updates on service initialization
    this.checkForUpdate();

    // Check for updates every 6 hours and when coming back online
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const onNetworkConnect$ = new Observable<void>((observer) => {
      window.addEventListener('online', () => observer.next());
    });

    concat(everySixHours$, onNetworkConnect$)
      .subscribe(() => this.checkForUpdate());

    // Handle version updates
    this.swUpdate.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          this.updateToLatestVersion();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          console.log(`Failed to install app version '${evt.version.hash}': ${evt.error}`);
          break;
      }
    });
  }

  private checkForUpdate(): void {
    this.swUpdate.checkForUpdate()
      .then(() => console.log('Checked for updates'))
      .catch(err => console.error('Failed to check for updates:', err));
  }

  private updateToLatestVersion(): void {
    this.swUpdate.activateUpdate().then(() => {
      console.log('Updated to latest version. Reloading...');
      document.location.reload();
    }).catch(err => {
      console.error('Failed to activate update:', err);
    });
  }
}
