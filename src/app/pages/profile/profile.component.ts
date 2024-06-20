import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewAddressModalComponent } from '../add-new-address-modal/add-new-address-modal.component';
import { SharedService } from 'src/app/@shared/shared.service';
import locations from 'src/assets/data/locality.json';
import * as Query from '../../@shared/queries';
import { nhost } from '../../@shared/global';
import swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  public userProfile: any;
  public profileForm : FormGroup;
  public addNewAddressForm : FormGroup;
  public localities: any;
  public nhost: any = nhost;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sharedService: SharedService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.createProfileForm(params?.id);
      this.localities = locations.locations;
      this.userProfile = await this.getUserProfile(params?.id);
      if (this.userProfile) {
        this.setProfileFormValue(this.userProfile);
      }
    });
  }

  async getUserProfile(id) {
    const { data, error } = await nhost.graphql.request(Query.GetUserProfile(id))
    return [...(data.user_profiles)][0];
  }

  createProfileForm(userId) {
    this.profileForm = this.formBuilder.group({
      user_id: [{value: userId, disabled: true}, [Validators.required]],
      name: [nhost.auth.getUser().displayName, [Validators.required, Validators.minLength(3)]],
      email: [nhost.auth.getUser().email, [Validators.required, Validators.minLength(3), Validators.email]],
      phone: [{value: nhost.auth.getUser().phoneNumber, disabled: true}, [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],
      address_id: ['', [Validators.required]],
      address_name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      locality: ['', [Validators.required, Validators.minLength(3)]],
      city: [{value: 'Chennai', disabled: true}, [Validators.required, Validators.minLength(3)]],
      // pincode: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],
      is_preferred_address: [true, [Validators.required]]
    });
  }

  setProfileFormValue(formData) {
    const addressObj = formData.user_addresses.filter(res => res.is_preferred_address === true)[0];
    this.profileForm.controls['name'].setValue(formData.name);
    this.profileForm.controls['email'].setValue(formData.email);
    this.profileForm.controls['phone'].setValue(formData.phone);
    this.profileForm.controls['address_id'].setValue(addressObj.id);
    this.profileForm.controls['address_name'].setValue(addressObj.address_name);
    this.profileForm.controls['address'].setValue(addressObj.address);
    this.profileForm.controls['locality'].setValue(addressObj.locality);
    this.profileForm.controls['city'].setValue(addressObj.city);
    // this.profileForm.controls['pincode'].setValue(addressObj.pincode);
    this.profileForm.controls['is_preferred_address'].setValue(addressObj.is_preferred_address);
  }
  selectAddress(addressName) {
    const addressObj = this.userProfile.user_addresses.filter(res => res.address_name === addressName)[0];
    this.profileForm.controls['address_id'].setValue(addressObj.id);
    this.profileForm.controls['address'].setValue(addressObj.address);
    this.profileForm.controls['locality'].setValue(addressObj.locality);
    this.profileForm.controls['city'].setValue(addressObj.city);
    // this.profileForm.controls['pincode'].setValue(addressObj.pincode);
    this.profileForm.controls['is_preferred_address'].setValue(addressObj.is_preferred_address);
  }
  
  openAddNewAddressModal() {
    const modalRef = this.modalService.open(AddNewAddressModalComponent, { windowClass: 'modal-mini', size: 'md', centered: true });
    modalRef.result.then(async (result: any) => {
      if (result !== 'Cross click') {
        console.log('result :', result);
        console.log(nhost.auth.getUser());
        const user_id = nhost.auth.getUser().id;
        result.user_id = user_id;
        await nhost.graphql.request(Query.AddUserAddress(result));
        this.userProfile = await this.getUserProfile(user_id);
        if (this.userProfile) {
          this.setProfileFormValue(this.userProfile);
        };
      }
    });
    // modalRef.componentInstance.serviceDetail = this.serviceDetail;
  }

  async submitUpdateProfile() {
    const formData = this.profileForm.getRawValue();
    if (this.userProfile && this.userProfile.is_profile_completed) {
      const addressObj = {
        user_id: formData.user_id,
        address_id: formData.address_id,
        address_name : formData.address_name,
        address: formData.address,
        locality: formData.locality,
        city: formData.city,
        // pincode: formData.pincode,
        is_preferred_address: formData.is_preferred_address
      };
      const userObj = {
        user_id: formData.user_id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email
      }

      await nhost.graphql.request(Query.UpdateUserProfile(userObj));
      await nhost.graphql.request(Query.UpdateUserAddress(addressObj));

    } else {
      const { data, error } = await nhost.graphql.request(Query.CreateUserProfile(formData));
      const alertType = (data) ? 'success' : 'error';
      this.showNotification(alertType);
    }
  }

  showNotification(type: string) {
    if (type == 'success') {
      swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your profile is updated successfully!',
        // footer: '<a href="">Why do I have this issue?</a>'
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.ngOnInit();
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
}