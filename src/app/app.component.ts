import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuperheroHqComponent } from './superhero-hq/superhero-hq.component';
import { WelcomeComponent } from './welcome/welcome.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SuperheroHqComponent,WelcomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'superhero-ABC123';
}
