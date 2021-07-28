import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  hidePass: boolean = true;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private snackbarService: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;

        if (this.roles.includes('ROLE_ADMIN')) {
          this.router.navigateByUrl('/admin').then((redirect) => {
            this.reloadPage();

            this.snackbarService.open('Welcome to Admin Panel', '', {
              duration: 5000,
            });
          });
        } else {
          this.router.navigateByUrl('/').then((redirect) => {
            this.reloadPage();

            this.snackbarService.open('Login Successful', '', {
              duration: 5000,
            });
          });
        }
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;

        this.snackbarService.open('Login Failed', '', {
          duration: 5000,
        });
      }
    );
  }

  togglePassHidden() {
    this.hidePass = !this.hidePass;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
