import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  // GET - for all activities
  remoteurl: string = 'http://localhost:8899/api/ticket';

  constructor(private httpService: HttpClient) {}

  // Get Remote tickets
  GetAllTickets(): Observable<Ticket> {
    return this.httpService
      .get<Ticket>(this.remoteurl)
      .pipe(retry(1), catchError(this.myerrorhandler));
  }

  // Get Remote tickets by customer id
  GetTicketsByCustomerId(customerId: number): Observable<Ticket> {
    return this.httpService
      .get<Ticket>(`${this.remoteurl}/${customerId}`)
      .pipe(retry(1), catchError(this.myerrorhandler));
  }

  // Error handling
  myerrorhandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
