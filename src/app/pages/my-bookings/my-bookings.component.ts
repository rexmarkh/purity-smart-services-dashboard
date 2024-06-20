import { Component, OnInit } from '@angular/core';
import { nhost } from '../../@shared/global';
import * as Query from '../../@shared/queries';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  public bookingsList: any;
  public activeBookings: any;
  public completedBookings: any;

  constructor() { }

  async ngOnInit(): Promise<void> {
    this.bookingsList = await this.getBookingsList(nhost.auth.getUser().id);
    this.activeBookings = this.bookingsList.filter(res => res.booking_status.status_id < 5);
    this.completedBookings = this.bookingsList.filter(res => res.booking_status.status_id == 5);
  }

  async getBookingsList(user_id) {
    const { data, error } = await nhost.graphql.request(Query.GetUserBookingsList(user_id))
    return [...(data.active_bookings)];
  }

  getBookingStatusColor (status_id: number) {
    let statusColor;
    switch (status_id) {
      case 1:
        statusColor = 'blue'
        break;
      case 6:
        statusColor = 'red'
        break;
      default:
        statusColor = 'green'
        break;
    }
    return statusColor;
  }
}
