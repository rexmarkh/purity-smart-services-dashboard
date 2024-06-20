import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ADMINROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  // { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
  { path: '/admin/new-bookings', title: 'New Bookings', icon: 'ni-pin-3 text-orange', class: '' },
  // { path: '/admin/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/admin/completed-services', title: 'Completed Services', icon: 'ni-bullet-list-67 text-red', class: '' },
  { path: '/admin/service-details', title: 'Service Details List', icon: 'ni-circle-08 text-pink', class: '' },
  // { path: '/admin/offer-details', title: 'Offer Details List', icon: 'ni-planet text-blue', class: '' },
  { path: '/admin/vendor-List', title: 'VendorList', icon: 'ni-circle-08 text-pink', class: '' },
  { path: '/admin/add-new-vendor', title: 'Add new vendor', icon: 'ni-circle-08 text-red', class: '' },
  { path: '/admin/logout', title: 'Logout', icon: 'ni-key-25 text-info', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ADMINROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
