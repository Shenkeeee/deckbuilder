import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormField, MatIcon, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {

  @Input() confirmPassword!: string;
  @Input() email!: string;
  @Input() password!: string;

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    this.authService.register(this.email, this.password)
      .then(() => {
        console.log('Registration successful');
        this.router.navigate(['/login']);
      }),
      (error: any) => {
        console.error('Registration failed:', error);
      };
  }
}
