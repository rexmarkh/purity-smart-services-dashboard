import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { nhost } from '../../@shared/global';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { getVendorDetails, GetUserProfile, GetServiceReview } from "../../@shared/queries";
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { LoginModalComponent } from '../../pages/login-modal/login-modal.component';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  public user;
  public serviceDetail: any;
  public userReviews: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal

  ) {
    // console.log(this.router.getCurrentNavigation().extras.state);
    this.serviceDetail = this.router.getCurrentNavigation().extras.state;
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params.prop) {
        const { data, error } = await nhost.graphql.request(getVendorDetails(params.prop))
        if (data) {
          this.user = {
            "displayName": data.user.displayName,
            "avatarUrl": data.user.avatarUrl,
            "address": data.vendor_profiles[0].address,
            "city": data.vendor_profiles[0].city,
            "locality": data.vendor_profiles[0].locality,
            "email": data.vendor_profiles[0].email,
            "phoneNumber": data.vendor_profiles[0].phone,
            "roles": "Vendor"
          }
        }
      } else if (params.User) {
        const { data, error } = await nhost.graphql.request(GetUserProfile(params.User))
        if (data) {
          this.user = {
            "displayName": data.user_profiles[0].user.displayName,
            "avatarUrl": data.user_profiles[0].user.avatarUrl,
            "address": data.user_profiles[0]?.user_addresses[0]?.address,
            "city": data.user_profiles[0]?.user_addresses[0]?.city,
            "locality": data.user_profiles[0]?.user_addresses[0]?.locality,
            "email": data.user_profiles[0].user.email,
            "phoneNumber": data.user_profiles[0].phone,
            "roles": "User"
          }

        }

      } else {
        this.user = nhost.auth.getUser();
      }
    })
    this.userReviews = await this.getUserReviews(this.serviceDetail.sid);
  }
  formatJSON(data) {
    let formattedData;
    formattedData.displayName = data.user.displayName
    formattedData.avatarUrl = data.user.avatarUrl
    formattedData.address = data.vendor_profiles[0].address
    formattedData.city = data.vendor_profiles[0].city
    formattedData.locality = data.vendor_profiles[0].locality
    formattedData.email = data.vendor_profiles[0].email
    formattedData.phone = data.vendor_profiles[0].phone
    return formattedData;
  }

  bookNow() {
    if (nhost.auth.getUser()) {
        this.openBookingModal();
    } else {
      this.openLoginModal();
    }
  }

  openLoginModal() {
		const modalRef = this.modalService.open(LoginModalComponent, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
      // console.log(`Closed with: ${result}`);
    })
  }

  openBookingModal() {
		const modalRef = this.modalService.open(BookingModalComponent, { windowClass: 'modal-mini', size: 'md', centered: true });
    modalRef.result.then((result) => {
      // console.log(`Closed with: ${result}`);
    });
    modalRef.componentInstance.serviceDetail = this.serviceDetail;
  }

  async getUserReviews(service_id) {
    const { data, error } = await nhost.graphql.request(GetServiceReview(service_id));
    return [...(data.user_reviews)]; 
  }
}
