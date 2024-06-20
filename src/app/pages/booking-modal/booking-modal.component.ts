import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, ValidatorFn } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import * as Query from '../../@shared/queries';
import { nhost } from '../../@shared/global';
import locations from 'src/assets/data/locality.json';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss']
})
export class BookingModalComponent implements OnInit {
  public localities: any;
  public selected: Date | null;
  public closeResult: string;
  public userProfile: any;
  public address_name: string;
  public selected_address: any;
  public addressForm : FormGroup;
  public addNewAddressForm : FormGroup;
  public summaryForm : FormGroup;
  public currentDate = Date.now();
  @Input() serviceDetail: any;
  @Input() public modalData: any;
  
  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  async ngOnInit() {
    this.localities = locations.locations;
    this.userProfile = await this.getUserProfile();
    this.selected_address = this.userProfile.user_addresses[0] || null;
  }

  openDateModal(modalContentRef) {
    this.activeModal.close('done');
    this.modalService.open(modalContentRef, { windowClass: 'modal-mini', size: 'md', centered: true });
  }

  openAddressModal(modalContentRef) {
    if (this.userProfile?.user_addresses?.length > 0) {
      this.createAddressForm(this.userProfile.user_addresses[0]);
    } else {
      this.createAddNewAddressForm();
    }
    this.modalService.open(modalContentRef, { windowClass: 'modal-mini', size: 'md', centered: true });
    this.activeModal.close();
  }

  openSummaryModal(modalContentRef) {
    this.modalService.open(modalContentRef, { windowClass: 'modal-mini', size: 'md', centered: true });
    this.activeModal.close();
  }

  close(data) {
    this.activeModal.close(data);
  }

  async getUserProfile() {
    const { data, error } = await nhost.graphql.request(Query.GetUserProfile(nhost.auth.getUser().id))
    if (data) {
      return [...(data.user_profiles)][0];
    }
  }

  updateAddress(event) {
    // console.log('updateAddress :', event);
    this.selected_address = this.userProfile.user_addresses.filter(res => res.address_name === event)[0];
    this.setAddressFormValue(this.selected_address);
  }

  createAddressForm(addressFormData) {
    this.addressForm = this.formBuilder.group({
      address_id: [{value: addressFormData.id, disabled: true}, [Validators.required]],
      address_name: [addressFormData.address_name, [Validators.required, Validators.minLength(3)]],
      address: [ {value: addressFormData.address, disabled: true}, [Validators.required, Validators.minLength(3)]],
      locality: [{value: addressFormData.locality, disabled: true}, [Validators.required, Validators.minLength(3)]],
      city: [{value: addressFormData.city, disabled: true}, [Validators.required, Validators.minLength(3)]],
    });
  }
  
  createAddNewAddressForm() {
    this.addNewAddressForm = this.formBuilder.group({
      address_name: ['', [Validators.required, Validators.minLength(3)]],
      address: [ '', [Validators.required, Validators.minLength(3)]],
      locality: ['', [Validators.required, Validators.minLength(3)]],
      city: [{value: 'Chennai', disabled: true}, [Validators.minLength(3)]],
      is_preferred_address: [true, [Validators.required]]
    });
  }

  async addNewAddress(modalContentRef: any, formData: any) {
    formData.user_id = this.userProfile.user.id;
    const { data, error } = await nhost.graphql.request(Query.AddUserAddress(formData));
    if (data) {
      this.selected_address = [...(data.insert_user_addresses.returning)][0];
      this.activeModal.close('done');
      this.openSummaryModal(modalContentRef);
    }
  }

  setAddressFormValue(formData) {
    this.addressForm.controls['address_id'].setValue(formData.id);
    this.addressForm.controls['address_name'].setValue(formData.address_name);
    this.addressForm.controls['address'].setValue(formData.address);
    this.addressForm.controls['locality'].setValue(formData.locality);
    this.addressForm.controls['city'].setValue(formData.city);
  }

  async onBookingFormSubmit() {
    let bookingData = {
      user_id : nhost.auth.getUser().id,
      service_id: this.serviceDetail.sid,
      service_date: this.datePipe.transform(this.selected, 'yyyy-MM-dd'),
      address_id: this.selected_address.id,
      address: this.selected_address.address,
      locality: this.selected_address.locality,
      city: this.selected_address.city,
      otp: this.generateOTP()
    }
    const { data, error } = await nhost.graphql.request(Query.ServiceBooking(bookingData));
    this.modalService.dismissAll();
    this.showNotification(data ? 'success' : 'error');
    this.activeModal.close();
  }

  showNotification(type: string) {
    if (type == 'success') {
      swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your service has been booked successfully!',
        // footer: '<a href="">Why do I have this issue?</a>'
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.router.navigateByUrl('user/home');
        }
      })
    } else {
      swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong! Try again.',
        // footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }

  generateOTP() {
    // Generate a random 4-digit number
    const OTP = Math.floor(1000 + Math.random() * 9000);
    return OTP;
  }
}
