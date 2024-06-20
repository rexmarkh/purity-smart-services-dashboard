import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

import { MaterialExampleModule } from './material.module';
import { GraphQLModule } from './@shared/graphql.module';

import { ComponentsModule } from './components/components.module';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { SharedService } from './@shared/shared.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    HttpClientModule,
    ComponentsModule,
    ReactiveFormsModule,
    GraphQLModule,
    MaterialExampleModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatDialogModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  exports: [
    MatFormFieldModule,
    MatTableModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    UserLayoutComponent,
    PrivacyPolicyComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    SharedService
  ]
})
export class AppModule { }
