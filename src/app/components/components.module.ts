import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ServiceCardWidgetComponent } from './service-card-widget/service-card-widget.component';
import { UserReviewWidgetComponent } from './user-review-widget/user-review-widget.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ServiceCardWidgetComponent,
    UserReviewWidgetComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ServiceCardWidgetComponent,
    UserReviewWidgetComponent
  ]
})
export class ComponentsModule { }
