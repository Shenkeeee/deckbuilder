import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { GuestAuthGuard } from '../../services/authGuards/auth-guard-guest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: '../../assets/styles/auth.scss',
})
export class LoginComponent implements OnInit{
  @Input() email!: string;
  @Input() password!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private guestAuthGuard: GuestAuthGuard
  ) {}

  ngOnInit(): void {
    if (!this.guestAuthGuard.canActivate()) {
      this.router.navigate(['/create'])
    }
  }

  login(): void {
    this.authService.login(this.email, this.password).then(() => {
      console.log('Login successful');
      this.router.navigate(['/create']);
    }),
      (error: any) => {
        console.error('Login failed:', error);
      };
  }
}
