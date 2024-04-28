import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule],
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
