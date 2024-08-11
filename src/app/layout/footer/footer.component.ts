import { Component, HostListener, OnInit, inject , NgZone} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  deferredPrompt: any;
  showInstallBtn = false;
  debugMessage = '';

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.checkInstallability();
  }

  private checkInstallability() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
          this.listenForInstallPrompt();
        })
        .catch(error => {
          this.debugMessage = `Service Worker registration failed: ${error}`;
          console.error('Service Worker registration failed:', error);
        });
    } else {
      this.debugMessage = 'Service Workers are not supported';
      console.log('Service Workers are not supported');
    }
  }

  private listenForInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      this.ngZone.run(() => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallBtn = true;
        this.debugMessage = 'Install prompt detected';
        console.log('Install prompt detected');
      });
    });
  }

  @HostListener('window:appinstalled', ['$event'])
  onAppInstalled(e: Event) {
    this.ngZone.run(() => {
      this.showInstallBtn = false;
      this.deferredPrompt = null;
      this.debugMessage = 'App installed successfully';
      console.log('App installed successfully');
    });
  }

  installPwa(): void {
    if (!this.deferredPrompt) {
      this.debugMessage = 'Installation prompt not available';
      console.log('Installation prompt not available');
      return;
    }

    this.showInstallBtn = false;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        this.debugMessage = 'User accepted the install prompt';
        console.log('User accepted the install prompt');
      } else {
        this.debugMessage = 'User dismissed the install prompt';
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
    });
  }
}
