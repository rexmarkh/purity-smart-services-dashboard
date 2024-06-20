import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import locations from 'src/assets/data/locality.json';

import { nhost } from '../../@shared/global';
import * as Query from '../../@shared/queries';


@Component({
  selector: 'app-new-bookings',
  templateUrl: './new-bookings.component.html',
  styleUrls: ['./new-bookings.component.scss']
})
export class NewBookingsComponent implements OnInit {

  public unAssignedServices: any;
  public vendorList: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public displayedColumns: string[] = ['booking_id', 'booking_status', 'customer_name', 'service_name', 'service_date', 'booking_date', 'locality', 'vendor_name'];
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) { }

  async ngOnInit() {
    this.getVendorList();
    this.unAssignedServices = this.deStructureServicesListData(await this.getUnassignedServiceList());
    this.dataSource = new MatTableDataSource(this.unAssignedServices);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deStructureServicesListData(data: any) {
    const temp = [];
    data.forEach(item => {
      temp.push({
        booking_id: item.booking_id,
        booking_status_name: item.booking_status.name,
        booking_status_id: item.booking_status.status_id,
        booking_date: item.booking_date,
        customer_id: item.user_profile?.user_id,
        customer_name: item.user_profile?.name,
        service_name: item.service_detail?.name,
        service_id: item.service_detail?.sid,
        service_date: item.service_date,
        locality: item.user_address?.locality,
        vendor_name: item.vendor_profile?.name,
        vendor_id: item.vendor_profile?.user_id
      });
    });
    return temp; 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getUnassignedServiceList() {

    const { data, error } = await nhost.graphql.request(Query.UnAssignedServices);
    if (data) {
      return [...(data.active_bookings)]
    }
  }
  async getVendorList() {
    const { data, error } = await nhost.graphql.request(Query.vendorList)
    if (data) {
      [...(data.vendor_profiles)].forEach(res => {
        if (res.is_vendor_available) {
          this.vendorList = [...(data.vendor_profiles)];
        }
      })
    }
  }

  openDialog(bookingData): void {
    const dialogRef = this.dialog.open(VendorAddDialogue, {
      data: bookingData,
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      this.ngOnInit();
    });
  }

  getBookingStatusColor (status_id: number) {
    let statusColor;
    switch (status_id) {
      case 1:
        statusColor = 'blue'
        break;
      case 2:
        statusColor = 'yellow'
        break;
      case 3:
        statusColor = 'green'
        break;   
      case 6:
        statusColor = 'red'
        break;
      default:
        statusColor = 'red'
        break;
    }
    return statusColor;
  }
}

@Component({
  selector: 'vendor-add-dialogue',
  templateUrl: 'vendor-add-dialogue.html',
  styleUrls: ['./new-bookings.component.scss']
})
export class VendorAddDialogue {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<VendorAddDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  public selectedVendor: string;
  public vendorControl = new FormControl('');
  public localityControl = new FormControl('');
  public serviceControl = new FormControl('');
  public filteredVendor: Observable<string[]>;
  public filteredLocality: Observable<string[]>;
  public filteredService: Observable<string[]>;
  public emailId;
  public status;
  public bookingId;
  public vendorList;
  public autoSuggestedData;
  public localities;
  public services;
  public selectedServiceId;

  async ngOnInit() {
    this.localities = locations.locations;
    this.localityControl.setValue(this.data.locality);
    this.services = await this.getServicesList();
    this.serviceControl.setValue(this.data.service_name);
    this.autoSuggestedData = await this.getAutoSuggestedVendor(this.data);
    if (this.autoSuggestedData.length > 0) {
      this.vendorControl.setValue(this.autoSuggestedData[0].vendor_profile.name);
    }
    // this.vendorList = await this.getVendorList();
    // console.log(this.vendorList);
    this.initFilters();
  }

  getPosts(emailId) {
    this.emailId = emailId;
    this.bookingId = this.data.bookingId
  }

  getServiceId(id) {
    this.selectedServiceId = id;
  }

  async assignVendor() {
    const { data, error } = await nhost.graphql.request(Query.AssignVendor(this.data.booking_id, this.autoSuggestedData[0].vendor_profile.user_id))
    if (data) {
      this.status = [data]
    }
    this.dialogRef.close();
  }
  eventSelection(event) {
    this.selectedVendor = event.date;
  }

  async searchVendor() {
    const data = {
      service_id: this.services.filter(res => res.name == this.serviceControl.getRawValue())[0].sid,
      locality: this.localityControl.getRawValue()
    }
    this.autoSuggestedData = await this.getAutoSuggestedVendor(data);
    if (this.autoSuggestedData.length > 0) {
      this.vendorControl.setValue(this.autoSuggestedData[0].vendor_profile.name);
      this.vendorList = this.autoSuggestedData;
    } else {
      this.vendorControl.setValue('');
    }
  }

  async getVendorList() {
    const { data, error } = await nhost.graphql.request(Query.vendorList);
    if (data) {
      return [...(data.vendor_profiles)].filter(res => res.is_vendor_available == true);
    }
  }

  async getServicesList() {
    const { data, error } = await nhost.graphql.request(Query.serviceDetailsList);
    if (data) {
      return [...(data.service_details)];
    }
  }

  async getAutoSuggestedVendor(bookingData: any) {
    const { data, error } = await nhost.graphql.request(Query.GetAutoSuggestedVendor(bookingData));
    if (data) {
      return [...(data.vendor_services)];
    }
  }

  initFilters() {
    this.filteredVendor = this.vendorControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterVendor(value || '')),
    );

    this.filteredLocality = this.localityControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLocality(value || '')),
    );

    this.filteredService = this.serviceControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterService(value || '')),
    );
  }

  private _filterVendor(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.vendorList?.filter(res => res.vendor_profile.name.toLowerCase().includes(filterValue));
  }

  private _filterLocality(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.localities?.filter(res => res.toLowerCase().includes(filterValue));
  }

  private _filterService(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.services?.filter(res => res.name.toLowerCase().includes(filterValue));
  }
}