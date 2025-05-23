import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DoP Deckbuilder';

  ngOnInit() {
    this.redirectFromDefault();
  }

  redirectFromDefault() {
    if (
      window.location.hostname == environment.defaultUrl ||
      window.location.hostname == environment.secondaryDefaultUrl
    ) {
      window.location.href = environment.mainUrl;
    }
  }
}
