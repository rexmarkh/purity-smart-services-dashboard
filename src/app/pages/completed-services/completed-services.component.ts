import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import * as Query from '../../@shared/queries';
import { nhost } from '../../@shared/global';

@Component({
  selector: 'app-completed-services',
  templateUrl: './completed-services.component.html',
  styleUrls: ['./completed-services.component.scss']
})
export class CompletedServices implements OnInit {
  public completedServices;
  public dataSource;
  public displayedColumns = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
  ) { }

  async ngOnInit() {
    this.displayedColumns = ["booking_id", "name", "phone", "service_detail", "booking_status", "service_date", "vendor_name", "booking_date"]
    this.completedServices = await this.getCompletedServicesList();
    const newData = this.deStructureServicesListData(await this.getCompletedServicesList());
    this.dataSource = new MatTableDataSource(newData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getCompletedServicesList() {
    const { data, error } = await nhost.graphql.request(Query.CompletedServices);
    if (data) {
      return [...(data.active_bookings)];
    }
  }
  
  deStructureServicesListData(data: any) {
    const temp = [];
    data.forEach(item => {
      temp.push({
        booking_id: item.booking_id,
        customer_id: item.user_profile?.user_id,
        customer_name: item.user_profile?.name,
        customer_phone: item.user_profile?.phone,
        service_name: item.service_detail?.name,
        service_date: item.service_date,
        booking_date: item.booking_date,
        booking_status_name: item.booking_status.name,
        locality: item.user_address?.locality,
        vendor_name: item.vendor_profile?.name,
        vendor_id: item.vendor_profile?.user_id,
      });
    });
    return temp; 
  }
}
