import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { NewBookingsComponent } from '../../pages/new-bookings/new-bookings.component';
import { VendorProfileComponent } from '../../pages/vendor-profile/vendor-profile.component';
import { CompletedServices } from '../../pages/completed-services/completed-services.component';
import { LogoutComponent } from '../../pages/logout/logout.component';
import { VendorListTableComponent } from '../../pages//vender-list-table/vender-list-table.component';
import { ServiceDetailsComponent } from '../../pages/serviceDetails/service-details.component';
import { OfferDetailsComponent } from '../../pages/offerDetails/offer-details.component';
import { AddNewVendorComponent } from 'src/app/pages/add-new-vendor/add-new-vendor.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'vendor-profile', component: VendorProfileComponent },
    { path: 'completed-services', component: CompletedServices },
    { path: 'icons', component: IconsComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'vendor-List', component: VendorListTableComponent },
    { path: 'service-details', component: ServiceDetailsComponent },
    { path: 'offer-details', component: OfferDetailsComponent },
    { path: 'new-bookings', component: NewBookingsComponent },
    { path: 'add-new-vendor', component: AddNewVendorComponent },
    // {
    //     path: '**',
    //     redirectTo: 'dashboard'
    // }
];
