import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import * as Query from '../../@shared/queries';
import { NgForm } from '@angular/forms';
import { nhost } from '../../@shared/global';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

export interface DialogData {
  details: {};
}

@Component({
  selector: 'app-vender-list-table',
  templateUrl: './vender-list-table.component.html',
  styleUrls: ['./vender-list-table.component.scss']
})
export class VendorListTableComponent implements OnInit {

  public vendorList: any;
  public vendor = { phone: '' };
  public url: any;

  constructor(
    public elRef: ElementRef,
    public dialog: MatDialog,
    public http: HttpClient
  ) { }

  async ngOnInit() {
    this.vendorList = await this.getVendorList();
    // this.vendorList[0].vendor_services = await this.getVendorServices(this.vendorList[0].user_id);
    // this.vendorList.forEach(async element => {
    //   element.vendor_services = await this.getVendorServices(element.user_id);
    // });
  }

  async submit(form: NgForm) {
    if (form.valid) {
      const { data, error } = await nhost.graphql.request(Query.addVendor(form.value.phone))
      if (data) {
        this.elRef.nativeElement.querySelector(".text-success").innerHTML = "Successfully added !!";
        this.elRef.nativeElement.querySelector(".error").style.display = "none";
        this.elRef.nativeElement.querySelector(".text-success").style.display = "block";
      } else if (error[0].extensions.code === 'constraint-violation') {
        this.elRef.nativeElement.querySelector(".error").innerHTML = "Email already Exists";
        this.elRef.nativeElement.querySelector(".text-success").style.display = "none";
        this.elRef.nativeElement.querySelector(".error").style.display = "block";
      }
      else {
        this.elRef.nativeElement.querySelector(".error").innerHTML = "We are facing an error in updating. Kindly contact admistrator";
        this.elRef.nativeElement.querySelector(".text-success").style.display = "none";
        this.elRef.nativeElement.querySelector(".error").style.display = "block";
      }

    }
  }
  openDialog(item): void {
    const dialogRef = this.dialog.open(VendorListDialogue, {
      width: '500px',
      data: { details: (typeof (item) !== 'number' ? item : {}) },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(async result => {
      // if (result.user_id) {
      //   const { data, error } = await nhost.graphql.request(Query.UpdateVendorDetails(result.user_id, result))
      // }
    });
  }
  async getVendorList() {
    const { data, error } = await nhost.graphql.request(Query.vendorList)
    if (data) {
      return [...(data.vendor_profiles)];
    }
  }
  async getVendorServices(vendorId) {
    const { data, error } = await nhost.graphql.request(Query.GetVendorServices(vendorId))
    if (data) {
      return [...(data.vendor_services)];
    }
  }
  async deleteVendor(id) {
    const { data, error } = await nhost.graphql.request(Query.DeleteVendor(id))
    if (data) {
      this.ngOnInit();
      // return [...(data.delete_vendor_profiles_by_pk)];
    }
  }
  async deleteVendorServices(id) {
    const { data, error } = await nhost.graphql.request(Query.DeleteVendorServices(id))
    if (data) {
      return await this.deleteVendor(id);
    }
  }
}

@Component({
  selector: 'vendor-list-dialogue',
  templateUrl: 'vendor-list-dialogue.html',
})

export class VendorListDialogue {
  constructor(
    public dialogRef: MatDialogRef<VendorListDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  serviceData: any;

  ngOnInit() {
  }

  async onClick() {
    this.dialogRef.close();
  }
}