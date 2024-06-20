import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { MaterialExampleModule } from '../../material.module';
import { GraphQLModule } from '../../@shared/graphql.module';
import { IconsComponent } from '../../pages/icons/icons.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { VendorProfileComponent, DocumentDialogue } from '../../pages/vendor-profile/vendor-profile.component';
import { CompletedServices } from '../../pages/completed-services/completed-services.component';
import { NewBookingsComponent, VendorAddDialogue } from '../../pages/new-bookings/new-bookings.component';
import { VendorListDialogue, VendorListTableComponent } from '../../pages/vender-list-table/vender-list-table.component';
import { ServiceDetailDialogue, ServiceDetailsComponent } from '../../pages/serviceDetails/service-details.component';
import { OfferDetailDialogue, OfferDetailsComponent } from '../../pages/offerDetails/offer-details.component';
import { AddNewVendorComponent } from '../../pages/add-new-vendor/add-new-vendor.component';

import { DocumentStatusPipe } from '../../@shared/document-status.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialExampleModule,
    NgbModule,
    MatSortModule,
    ClipboardModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    GraphQLModule,
    MatPaginatorModule
  ],
  declarations: [
    DashboardComponent,
    VendorProfileComponent,
    CompletedServices,
    VendorListTableComponent,
    ServiceDetailsComponent,
    ServiceDetailDialogue,
    VendorListDialogue,
    DocumentDialogue,
    OfferDetailsComponent,
    OfferDetailDialogue,
    IconsComponent,
    VendorAddDialogue,
    NewBookingsComponent,
    AddNewVendorComponent,
    DocumentStatusPipe
  ], 
  exports: [
    MatFormFieldModule
  ]
})

export class AdminLayoutModule { }
