import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Activity } from 'src/app/models/activity';
import { ActivityService } from 'src/app/services/activity.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[];
  filteredActivities: Activity[];
  activityToSearch: string;
  cart = [];

  constructor(
    private activityService: ActivityService,
    private cartService: CartService,
    private snakbarService: MatSnackBar,
    private router: Router,
    private tokenService: TokenStorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllActivities();
  }

  loadAllActivities() {
    return this.activityService.GetAllActivities().subscribe((data: any) => {
      this.activities = data;
      this.filteredActivities = data;
    });
  }

  performFilterOnActivity() {
    if (this.activityToSearch && isNaN(parseInt(this.activityToSearch))) {
      this.filteredActivities = this.activities.filter((activity: Activity) => {
        return activity.activityName
          .toLocaleLowerCase()
          .includes(this.activityToSearch.toLocaleLowerCase());
      });
    } else if (parseInt(this.activityToSearch)) {
      this.filteredActivities = this.activities.filter((activity: Activity) => {
        return activity.charges == parseInt(this.activityToSearch);
      });
    } else {
      this.loadAllActivities();
    }
  }

  openKnowMoreDialog(activityName: string, activityDescription: string) {
    this.dialog.open(KnowMoreDialog, {
      width: '500px',
      data: { name: activityName, description: activityDescription },
    });
  }

  addToCart(activity: Activity) {
    if (this.tokenService.getToken()) {
      let result: boolean = this.cartService.addToCartService(activity);

      if (result) {
        let snakbarRef = this.snakbarService.open(
          'Added item to cart',
          'View cart',
          {
            duration: 5000,
          }
        );
        snakbarRef.onAction().subscribe(() => {
          this.router.navigateByUrl('/cart');
        });
      } else {
        this.snakbarService.open('Item already present in cart', '', {
          duration: 5000,
        });
      }
    } else {
      this.router.navigateByUrl('/login');

      this.snakbarService.open('Login is required', '', {
        duration: 5000,
      });
    }
  }
}

@Component({
  template: `
    <div style="padding: 24px">
      <button class="close" mat-button (click)="onCloseClick()">X</button>
      <h1 mat-dialog-title>{{ data.name }}</h1>
      <div mat-dialog-content>
        {{ data.description }}
      </div>
    </div>
  `,
})
export class KnowMoreDialog {
  constructor(
    public dialogRef: MatDialogRef<KnowMoreDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
