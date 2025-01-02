import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
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
export class LoginComponent {
  @Input() email!: string;
  @Input() password!: string;
  deckCodeParam = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private guestAuthGuard: GuestAuthGuard
  ) {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params.get('deckCode'));
      console.log(params);
      this.deckCodeParam = params.get('deckCode') ?? this.deckCodeParam;
    });
  }

  login(): void {
    this.authService.login(this.email, this.password).then(() => {
      console.log('Login successful');
      this.router.navigate(['/create'], {
        queryParams: {
          deckCode: this.deckCodeParam
        },
      });
    }),
      (error: any) => {
        console.error('Login failed:', error);
      };
  }
}
