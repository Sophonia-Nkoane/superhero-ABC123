import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  private platform = inject(Platform);

  deferredPrompt: any;
  showInstallBtn = false;

  ngOnInit() {
    if (this.platform.ANDROID || this.platform.IOS) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallBtn = true;
      });
    }
  }

  @HostListener('window:appinstalled', ['$event'])
  onAppInstalled(e: Event) {
    this.showInstallBtn = false;
    this.deferredPrompt = null;
  }

  installPwa(): void {
    this.showInstallBtn = false;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
    });
  }
}
