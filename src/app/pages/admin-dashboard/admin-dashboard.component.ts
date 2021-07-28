import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Activity } from 'src/app/models/activity';
import { Customer } from 'src/app/models/customer';
import { Ticket } from 'src/app/models/ticket';
import { ActivityService } from 'src/app/services/activity.service';
import { CustomerService } from 'src/app/services/customer.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  displayedCustomerColumns: string[] = [
    'customer id',
    'customer name',
    'email',
    'address',
    'mobile number',
    'tickets',
  ];
  displayedActivityColumns: string[] = [
    'activity id',
    'activity name',
    'description',
    'charges',
    'edit action',
    'remove action',
  ];
  displayedTicketColumns: string[] = [
    'ticket id',
    'date',
    'bill',
    'activities',
  ];

  dataSourceActivity = new MatTableDataSource<Activity>();
  dataSourceCustomer = new MatTableDataSource<Customer>();
  dataSourceTicket = new MatTableDataSource<Ticket>();

  @ViewChild('MatPaginator1') customerPaginator: MatPaginator;
  @ViewChild('MatPaginator2') activityPaginator: MatPaginator;
  @ViewChild('MatPaginator3') ticketPaginator: MatPaginator;

  result: boolean;
  activity: Activity;

  activityToSearch: string;
  customerToSearch: string;
  ticketToSearch: string;
  filteredActivities: Activity[];
  filteredCustomers: Customer[];
  filteredTickets: Ticket[];

  constructor(
    private activityService: ActivityService,
    private customerService: CustomerService,
    private ticketService: TicketService,
    private snackbarService: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAllActivities();
    this.loadAllCustomers();
    this.loadAllTickets();
  }

  loadAllActivities() {
    this.activityService.GetAllActivities().subscribe((data: any) => {
      this.dataSourceActivity = new MatTableDataSource<Activity>(data);
      this.dataSourceActivity.paginator = this.activityPaginator;
    });
  }

  loadAllCustomers() {
    return this.customerService.GetAllCustomers().subscribe((data: any) => {
      this.dataSourceCustomer = new MatTableDataSource<Customer>(data);
      this.dataSourceCustomer.paginator = this.customerPaginator;
    });
  }

  loadAllTickets() {
    return this.ticketService.GetAllTickets().subscribe((data: any) => {
      this.dataSourceTicket = new MatTableDataSource<Ticket>(data);
      this.dataSourceTicket.paginator = this.ticketPaginator;
    });
  }

  registrationform = new FormGroup({
    activityId: new FormControl(''),
    activityName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    charges: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    chargeDetails: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.registrationform.status == 'VALID') {
      this.activityService.RegisterNewActivity(this.registrationform.value);

      this.snackbarService.open('Activity added successfully', '', {
        duration: 5000,
      });

      window.location.reload();
    } else {
      this.snackbarService.open('Activity details are not valid', '', {
        duration: 5000,
      });
    }
  }

  setClickedRow(id: number) {
    this.result = confirm('Are you sure you want to delete?');

    if (this.result == true) {
      this.activityService.delete(id).subscribe((data: any) => {
        this.ngOnInit();

        this.snackbarService.open('Activity delete', '', {
          duration: 5000,
        });
      });
    } else {
      this.snackbarService.open('Activity was not deleted', '', {
        duration: 5000,
      });
    }
  }

  activityupdateform = new FormGroup({
    activityId: new FormControl(''),
    activityName: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    charges: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    chargeDetails: new FormControl('', [Validators.required]),
  });

  update(activity: any) {
    this.activityupdateform.patchValue({
      activityId: activity.activityId,
      activityName: activity.activityName,
      description: activity.description,
      charges: activity.charges,
      imageUrl: activity.imageUrl,
      chargeDetails: activity.chargeDetails,
    });
  }

  onUpdate() {
    if (this.activityupdateform.status == 'VALID') {
      this.activityService
        .update(this.activityupdateform.value)
        .subscribe((data) => {});

      this.snackbarService.open('Activity updated successfully', '', {
        duration: 5000,
      });

      window.location.reload();
    } else {
      this.snackbarService.open('Activity details are not valid', '', {
        duration: 5000,
      });
    }
  }

  performFilterOnActivities() {
    if (this.activityToSearch) {
      this.filteredActivities = this.dataSourceActivity.data.filter(
        (activity: Activity) => {
          return activity.activityName
            .toLocaleLowerCase()
            .includes(this.activityToSearch.toLocaleLowerCase());
        }
      );

      this.dataSourceActivity = new MatTableDataSource<Activity>(
        this.filteredActivities
      );
    } else {
      this.loadAllActivities();
    }
  }

  performFilterOnCustomers() {
    if (this.customerToSearch) {
      this.filteredCustomers = this.dataSourceCustomer.data.filter(
        (customer: Customer) => {
          return customer.username
            .toLocaleLowerCase()
            .includes(this.customerToSearch.toLocaleLowerCase());
        }
      );

      this.dataSourceCustomer = new MatTableDataSource<Customer>(
        this.filteredCustomers
      );
    } else {
      this.loadAllCustomers();
    }
  }

  performFilterOnTickets() {
    if (this.ticketToSearch && this.ticketToSearch.length >= 4) {
      this.filteredTickets = this.dataSourceTicket.data.filter(
        (ticket: Ticket) =>
          ticket.ticketId.toString().toLocaleLowerCase() ==
          this.ticketToSearch.toLocaleLowerCase()
      );

      this.dataSourceTicket = new MatTableDataSource<Ticket>(
        this.filteredTickets
      );
    } else {
      this.loadAllTickets();
    }
  }
}
