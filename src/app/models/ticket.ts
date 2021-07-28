import { Activity } from './activity';
import { Customer } from './customer';

export class Ticket {
  bill: number;
  date: string;
  activities: Activity[];
  customer: Customer;
  ticketId?: number;

  constructor(
    bill: number,
    date: string,
    activities: Activity[],
    customer: Customer
  ) {
    this.bill = bill;
    this.date = date;
    this.activities = activities;
    this.customer = customer;
  }
}
