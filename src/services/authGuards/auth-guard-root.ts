import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class RootAuthGuard implements CanActivate {
  deckCodeParam = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params.get('deckCode'));
      console.log(params);
      this.deckCodeParam = params.get('deckCode') ?? this.deckCodeParam;
    });
  }

  canActivate(): boolean {
    let navigateTo = '';
    if (this.authService.isLoggedIn()) {
      navigateTo = '/create';
    } else {
      console.log('to login');
      navigateTo = '/login';
    }
    this.router.navigate([navigateTo], {
      queryParams: {
        deckCode: this.deckCodeParam,
      },
    });
    return false;
  }
}
