import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import locations from 'src/assets/data/locality.json';
import * as Query from '../../@shared/queries';
import { nhost } from '../../@shared/global';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-vendor',
  templateUrl: './add-new-vendor.component.html',
  styleUrls: ['./add-new-vendor.component.scss']
})
export class AddNewVendorComponent implements OnInit {
  public servicesList: any;
  public profileForm : FormGroup;
  public addNewAddressForm : FormGroup;
  public localities: any;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    this.createProfileForm();
    this.localities = locations.locations;
    this.servicesList = await this.getServicesList();
  }


  createProfileForm() {
    this.profileForm = this.formBuilder.group({
      user_id: [{value: '', disabled: true}, [Validators.required]],
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.minLength(10)]],
      address: ['', [Validators.minLength(3)]],
      locality: ['', [Validators.required, Validators.minLength(3)]],
      city: [{value: 'Chennai', disabled: true}, [Validators.required, Validators.minLength(3)]],
      pincode: ['', [Validators.pattern('^[1-9][0-9]{5}$')]],
      wallet_money: ['', [Validators.min(0)]],
      is_profile_completed: [false],
    });
  }

  setProfileFormValue(formData) {
    const addressObj = formData.user_addresses.filter(res => res.is_preferred_address === true)[0];
    this.profileForm.controls['displayName'].setValue(formData.name);
    this.profileForm.controls['email'].setValue(formData.email);
    this.profileForm.controls['phoneNumber'].setValue(formData.phone);
    this.profileForm.controls['address'].setValue(addressObj.address);
    this.profileForm.controls['locality'].setValue(addressObj.locality);
    this.profileForm.controls['city'].setValue(addressObj.city);
    this.profileForm.controls['pincode'].setValue(addressObj.pincode);
  }
  

  async createVendor() {
    const vendorData = this.profileForm.getRawValue();
    const { data, error } = await nhost.graphql.request(Query.InsertNewVendor(vendorData))
    if (data) {
      const vendorObj = {
        user_id: data.insertUser.id,
        name : vendorData.displayName,
        phone: vendorData.phoneNumber,
        email: vendorData.email,
        address: vendorData.address,
        locality: vendorData.locality,
        city: vendorData.city,
        pincode: vendorData.pincode,
        is_profile_completed: vendorData.is_profile_completed,
        wallet_money: vendorData.wallet_money || 0,
      };
      await this.addNewVendorProfile(vendorObj);
      const services = this.servicesList.filter(res => res.checked === true);
      for await (const service of services) {
        await this.addNewVendorService({service_id : service.sid, vendor_id: data.insertUser.id})
      }
      this.showNotification('success');
    }    
  }

  async getServicesList() {
    const { data, error } = await nhost.graphql.request(Query.serviceDetailsList)
    if (data) {
      return [...(data.service_details)];
    }
  }

  async addNewVendorService(serviceData) {
    const { data, error } = await nhost.graphql.request(Query.InsertVendorService(serviceData))
    if (data) {
      // console.log(data);
    }
  }

  async addNewVendorProfile(vendorData) {
    const { data, error } = await nhost.graphql.request(Query.InsertNewVendorProfile(vendorData))
    if (data) {
      return [...(data.insert_vendor_profiles.returning)][0];
    }
  }

  updateServiceList(event, service) {
    this.servicesList.filter(res => res.sid === service.sid)[0].checked = true;
  }

  showNotification(type: string) {
    if (type == 'success') {
      swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Vendor added successfully!',
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
