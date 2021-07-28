import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from 'src/app/models/ticket';
import { TicketService } from 'src/app/services/ticket.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-userorder',
  templateUrl: './userorder.component.html',
  styleUrls: ['./userorder.component.css'],
})
export class UserorderComponent implements OnInit {
  displayedTicketColumns: string[] = [
    'ticket id',
    'activities',
    'date',
    'bill',
  ];

  dataSourceTicket = new MatTableDataSource<Ticket>();

  // @ViewChild('MatPaginator') ticketPaginator: MatPaginator;

  ticketToSearch: string;
  filteredTickets: Ticket[];

  constructor(
    private ticketService: TicketService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.loadAllTickets();
  }

  loadAllTickets() {
    return this.ticketService
      .GetTicketsByCustomerId(this.tokenService.getUser().id)
      .subscribe((data: any) => {
        this.dataSourceTicket = new MatTableDataSource<Ticket>(data);
        // this.dataSourceTicket.paginator = this.ticketPaginator;
      });
  }

  performFilterOnTickets() {
    if (this.ticketToSearch && this.ticketToSearch.length >= 4) {
      this.filteredTickets = this.dataSourceTicket.data.filter(
        (ticket: Ticket) => ticket.ticketId === parseInt(this.ticketToSearch)
      );

      this.dataSourceTicket = new MatTableDataSource<Ticket>(
        this.filteredTickets
      );
    } else {
      this.loadAllTickets();
    }
  }
}
