import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthGuard } from '../services/authGuards/auth-guard';
import { AdminAuthGuard } from '../services/authGuards/auth-guard-admin';
import { GuestAuthGuard } from '../services/authGuards/auth-guard-guest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-container',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar-container.component.html',
  styleUrl: './navbar-container.component.scss'
})
export class NavbarContainerComponent {

  constructor(private authService: AuthService, private router: Router,
    private authGuard: AuthGuard, private adminAuthGuard: AdminAuthGuard,
    private guestAuthGuard: GuestAuthGuard) { }

  signOut(): void {
    this.authService.signOut()
      .then(() => {
        console.log('Sign out successful');
        this.router.navigate(['/login']);
      }),
      (error: any) => {
        console.error('SignOut failed:', error);
      };
  }

  isAdmin(): boolean {
    return this.adminAuthGuard.canActivate(); // Assuming canActivate returns true or false
  }

  isAuthenticated(): boolean {
    return this.authGuard.canActivate(); // Assuming canActivate returns true or false
  }

  isGuest(): boolean {
    return this.guestAuthGuard.canActivate(); // Assuming canActivate returns true or false
  }
}
