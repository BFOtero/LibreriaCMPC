import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styles: [],
})
export class MainLayoutComponent {
  currentUser: string = sessionStorage.getItem('user')!.slice(1, -1);
  isAdmin = false;
  showUserMenu = false;
  showMobileMenu = false;
  private destroy$ = new Subject<void>();

  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const names = this.currentUser.split(' ');
    return names
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
