import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar-container',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar-container.component.html',
  styleUrl: './navbar-container.component.scss'
})
export class NavbarContainerComponent {

  constructor(private authService: AuthService, private router: Router) { }
  
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
}
