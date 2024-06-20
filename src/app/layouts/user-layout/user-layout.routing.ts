import { Routes } from '@angular/router';
import { LogoutComponent } from 'src/app/pages/logout/logout.component';
import { MyBookingsComponent } from 'src/app/pages/my-bookings/my-bookings.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { ServiceDetailsComponent } from 'src/app/pages/service-details/service-details.component';
import { UserHomeComponent } from 'src/app/pages/user-home/user-home.component';
// import { AdminProfileComponent } from 'src/app/pages/vendor-profile/admin-profile.component';

export const UserLayoutRoutes: Routes = [
    { path: 'home', component: UserHomeComponent },
    // { path: 'user-profile', component: AdminProfileComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'my-bookings', component: MyBookingsComponent},
    { path: 'service-details/:id', component: ServiceDetailsComponent },
    { path: 'logout', component: LogoutComponent },
    {
        path: '**',
        redirectTo: 'home'
    }
];
