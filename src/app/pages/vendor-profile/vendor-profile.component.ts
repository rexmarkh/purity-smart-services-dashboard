import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { nhost } from '../../@shared/global';
import * as Query from '../../@shared/queries';
import swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})
export class VendorProfileComponent implements OnInit {

  public vendorProfileData: any;
  public vendorProfileForm : FormGroup;
  public servicesList: any;
  public aadharFileUrl: any;
  public panFileUrl: any;
  public documentStatus: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.documentStatus = [
      {id: 1, name: 'Not Uploaded'},
      {id: 2, name: 'Need to be verified'},
      {id: 3, name: 'Approved'},
      {id: 4, name: 'Rejected'}
    ];

    this.route.queryParams.subscribe(async params => {
      if (params.id) {
        this.createVendorProfileForm(params?.id);
        this.servicesList = await this.getServicesList();
        const { data, error } = await nhost.graphql.request(Query.getVendorDetails(params.id))
        if (data) {
          this.vendorProfileData = data.vendor_profiles[0];
          this.vendorProfileData.vendor_services.forEach(service => {
            this.servicesList.filter(res => {
                if (res.sid == service.service_detail.sid) {
                  res.checked = true;
                }
            })
          });
          if (this.vendorProfileData?.aadhar_status?.id !== 1) {
            this.aadharFileUrl = await this.getDocumentUrl(this.vendorProfileData?.aadhar_file_id);
          }
          if (this.vendorProfileData?.pan_status?.id !== 1) {
            this.panFileUrl = await this.getDocumentUrl(this.vendorProfileData?.pan_file_id);
          }
          this.setVendorProfileFormValue(this.vendorProfileData);
        }
      }
    })
  }

  createVendorProfileForm(userId) {
    this.vendorProfileForm = this.formBuilder.group({
      user_id: [{value: userId, disabled: true}, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      is_profile_completed: [ {value: false, disabled: true}, [Validators.required]],
      aadhar_file_status: [ {value: 1, disabled: false}, [Validators.required]],
      pan_file_status: [ {value: 1, disabled: false}, [Validators.required]],
      wallet_money: ['', [Validators.min(0)]],
      role: [{value: 'vendor', disabled: true}, [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
      phone: [{value: '', disabled: true}, [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      locality: ['', [Validators.required, Validators.minLength(3)]],
      city: [{value: '', disabled: true}, [Validators.required, Validators.minLength(3)]],
      pincode: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],
    });
  }

  setVendorProfileFormValue(profileData) {
    this.vendorProfileForm.controls['name'].setValue(profileData.name);
    this.vendorProfileForm.controls['email'].setValue(profileData.email);
    this.vendorProfileForm.controls['phone'].setValue(profileData.phone);
    this.vendorProfileForm.controls['wallet_money'].setValue(profileData.wallet_money);
    this.vendorProfileForm.controls['is_profile_completed'].setValue(profileData.is_profile_completed);
    this.vendorProfileForm.controls['aadhar_file_status'].setValue(profileData.aadhar_status.id);
    this.vendorProfileForm.controls['pan_file_status'].setValue(profileData.pan_status.id);
    this.vendorProfileForm.controls['address'].setValue(profileData.address);
    this.vendorProfileForm.controls['locality'].setValue(profileData.locality);
    this.vendorProfileForm.controls['city'].setValue(profileData.city);
    this.vendorProfileForm.controls['pincode'].setValue(profileData.pincode);
  }

  updateServiceList(event, service) {
    this.vendorProfileData.vendor_services.push({
      service_detail : {
        sid : service.sid,
        name: service.name,
        checked: true
      }
    });
  }

  async getServicesList() {
    const { data, error } = await nhost.graphql.request(Query.serviceDetailsList)
    if (data) {
      return [...(data.service_details)];
    }
  }

  async UpdateVendorDetails() {
    const { data, error } = await nhost.graphql.request(Query.UpdateVendorDetails(this.vendorProfileForm.getRawValue()))
    if (data) {
      this.showNotification('success');
    }
  }

  showNotification(type: string) {
    if (type == 'success') {
      swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Vendor profile updated successfully!',
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

  async getDocumentUrl(id: any) {
    const { presignedUrl, error } = await nhost.storage.getPresignedUrl({
      fileId: `${id}`
    })
    if (error) {
      throw error
    }
    return presignedUrl.url
  }

  openDialog(url): void {
    const dialogRef = this.dialog.open(DocumentDialogue, {
      maxHeight: '100% !important',
      maxWidth: '100% !important',
      height: '100% !important',
      width: '100% !important',
      data: url,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(async result => {
      // if (result.user_id) {
      //   const { data, error } = await nhost.graphql.request(Query.UpdateVendorDetails(result.user_id, result))
      // }
    });
  }
}


@Component({
  selector: 'document-dialogue',
  templateUrl: 'document-dialogue.html',
})

export class DocumentDialogue {
  constructor(
    public dialogRef: MatDialogRef<DocumentDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  async onClick() {
    this.dialogRef.close();
  }
}