import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  activities: Activity[];
  private remoteurl: string = 'http://localhost:8899/api/ticket';
  // For adding new ticket
  data: Object | undefined;

  itemsInCartSubject: BehaviorSubject<Activity[]> = new BehaviorSubject([]);

  constructor(private httpService: HttpClient) {
    this.itemsInCartSubject.subscribe((_) => (this.activities = _));
  }

  getCartItems(): any {
    const cartItems = window.sessionStorage.getItem('cartItems');

    if (cartItems) {
      return JSON.parse(cartItems);
    } else {
      return {};
    }
  }

  RegisterNewTicket(body: Ticket): any {
    const headers = {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    this.httpService
      .post<Ticket>(this.remoteurl, body, {
        headers: headers,
      })
      .subscribe((data: Object | undefined) => {
        this.data = data;
      });
  }

  addToCartService(activity: Activity): boolean {
    if (this.activities.includes(activity)) {
      console.log('Value already present');
      return false;
    } else {
      this.itemsInCartSubject.next([...this.activities, activity]);
      return true;
    }
  }

  removeFromCartService(activity: Activity): boolean {
    if (this.activities.includes(activity)) {
      let index = this.activities.indexOf(activity);
      if (index > -1) {
        this.activities.splice(index, 1);
      }
      this.itemsInCartSubject.next([...this.activities]);

      return true;
    } else {
      console.log('Value not present');
      return false;
    }
  }

  getActivities(): Observable<Activity[]> {
    return this.itemsInCartSubject;
  }

  clearCart() {
    return this.itemsInCartSubject.next([]);
  }
}
