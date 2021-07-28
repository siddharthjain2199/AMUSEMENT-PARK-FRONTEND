import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { Activity } from 'src/app/models/activity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Ticket } from 'src/app/models/ticket';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  activities: Observable<Activity[]> = of([]);
  shoppingCartItems: Activity[];
  displayedCartColumns: string[] = ['activity', 'details', 'price', 'action'];
  totalAmount: number = 0;
  ticketData: Ticket;
  customer: Customer;

  constructor(
    private cusomterService: CustomerService,
    private cartService: CartService,
    private tokenService: TokenStorageService,
    private snakbarService: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.activities = this.cartService.getActivities();

    this.activities.subscribe((_) => (this.shoppingCartItems = _));
  }

  ngOnInit(): void {
    this.calculateCartPrice();
  }

  calculateCartPrice() {
    this.shoppingCartItems.forEach((activity: Activity) => {
      this.totalAmount += activity.charges;
    });
  }

  removeFromCart(activity: Activity) {
    let result: boolean = this.cartService.removeFromCartService(activity);

    if (this.shoppingCartItems.length == 0) {
      this.totalAmount = 0;
    } else {
      this.totalAmount -= activity.charges;
    }

    if (result) {
      this.snakbarService.open('Item removed from cart', '', {
        duration: 5000,
      });
    }
  }

  orderNow() {
    if (this.tokenService.getToken()) {
      // create a ticket
      this.cusomterService
        .GetCustomerById(this.tokenService.getUser().id)
        .subscribe((c: Customer) => {
          var myDate = new Date();
          var myDateString;

          myDate.setDate(myDate.getDate());

          myDateString =
            myDate.getFullYear() +
            '-' +
            ('0' + (myDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + myDate.getDate()).slice(-2);

          this.ticketData = new Ticket(
            this.totalAmount,
            myDateString,
            this.shoppingCartItems,
            c
          );

          this.cartService.RegisterNewTicket(this.ticketData);

          this.cartService.clearCart();

          const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '40%',
          });

          dialogRef.afterClosed().subscribe((result) => {
            this.router.navigateByUrl('/myorder');

            this.snakbarService.open('Order placed successfully', '', {
              duration: 5000,
            });
          });
        });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}

@Component({
  selector: 'order-dialog',
  template: `<h1 mat-dialog-title>Order Confirmation</h1>
    <div mat-dialog-content>
      <p>Your booking is successful!</p>
      <img
        src="https://i.pinimg.com/originals/35/f3/23/35f323bc5b41dc4269001529e3ff1278.gif"
        alt="Order animation"
        class="img img-fluid p-2 rounded"
      />
    </div>
    <button
      class="btn btn-success btn-lg btn-block mt-2"
      color="primary"
      (click)="onClick()"
    >
      Go to orders
    </button>`,
})
export class DialogOverviewExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {}

  onClick(): void {
    this.dialogRef.close();
  }
}
