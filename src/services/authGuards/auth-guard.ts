import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  deckCodeParam = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe((params) => {
      console.log(this.route.url);
      console.log(params.get('deckCode'));
      console.log(params);
      this.deckCodeParam = params.get('deckCode') ?? this.deckCodeParam;
    });
  }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      if (this.router.url.split('?')[0] !== '/login') {
        this.router.navigate(['login'], {
          queryParams: {
            deckCode: this.deckCodeParam,
          },
        });
      }
      return false;
    }
  }
}
