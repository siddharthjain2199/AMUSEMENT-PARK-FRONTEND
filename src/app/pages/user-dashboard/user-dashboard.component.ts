import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  customerFromToken: any;
  fetchedCustomerName: string;
  fetchedCustomerEmail: string;
  customerFormData: Customer;
  result: boolean;

  constructor(
    private customerService: CustomerService,
    private tokenStorageService: TokenStorageService,
    private snakbarService: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.customerFromToken = this.tokenStorageService.getUser();
    this.loadremotecustomerById(this.customerFromToken.id);
  }

  loadremotecustomerById(customerId: number) {
    return this.customerService
      .GetCustomerById(customerId)
      .subscribe((customerData: Customer) => {
        this.fetchedCustomerName = customerData.username;
        this.fetchedCustomerEmail = customerData.email;
        this.customerFormData = customerData;
      });
  }

  customerupdateform = new FormGroup({
    customerId: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    mobileNumber: new FormControl('', [
      Validators.required,
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
    ]),
  });

  onUpdate() {
    this.result = confirm('Are you sure you want to update details?');
    if (this.result == true) {
      if (this.customerupdateform.status == 'VALID') {
        this.customerService
          .update(this.customerFormData)
          .subscribe((data) => {});

        this.snakbarService.open('User updated', '', {
          duration: 5000,
        });
      } else {
        this.snakbarService.open('User details are not valid', '', {
          duration: 5000,
        });

        this.ngOnInit();
      }
    } else {
      this.snakbarService.open('User is not updated', '', {
        duration: 5000,
      });
    }
  }
}
