import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './services/cart.service';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  noOfItemsInCart: number;

  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
    }

    this.cartService.itemsInCartSubject.subscribe((items) => {
      this.noOfItemsInCart = items.length;
    });
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }
}
