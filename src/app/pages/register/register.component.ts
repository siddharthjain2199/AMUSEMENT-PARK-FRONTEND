import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    mobileNumber: null,
    address: null,
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  hidePass: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbarService: MatSnackBar
  ) {}

  ngOnInit(): void {}

  togglePassHidden() {
    this.hidePass = !this.hidePass;
  }

  onSubmit(): void {
    const { username, email, password, mobileNumber, address } = this.form;

    this.authService
      .register(username, email, password, mobileNumber, address)
      .subscribe(
        (data) => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;

          this.router.navigateByUrl('/login').then((redirect) => {
            this.snackbarService.open('Registered Successfully', '', {
              duration: 5000,
            });
          });
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;

          this.snackbarService.open('Registration Failed', '', {
            duration: 5000,
          });
        }
      );
  }
}
