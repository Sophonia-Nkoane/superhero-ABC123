import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { NetworkStatusService } from './services/network-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'superhero-ABC123';
  isOnline: boolean = true;
  private subscription: Subscription | undefined;

  constructor(private networkStatusService: NetworkStatusService) {}

  ngOnInit() {
    this.subscription = this.networkStatusService.getNetworkStatus().subscribe(
      status => this.isOnline = status
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
