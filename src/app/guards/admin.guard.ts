import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private token: TokenStorageService,
    private router: Router
  ) {}

  canActivate() {
    if (
      this.auth.loggedIn() &&
      this.token.getUserRole().includes('ROLE_ADMIN')
    ) {
      return true;
    } else {
      this.router.navigate(['404']);
      return false;
    }
  }
}
