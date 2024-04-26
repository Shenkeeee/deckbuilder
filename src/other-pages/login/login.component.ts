import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  @Input() email!: string;
  @Input() password!: string;

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('Login successful');
        this.router.navigate(['/']);
      }),
      (error: any) => {
        console.error('Login failed:', error);
      };
  }
}
