import { Component, ElementRef, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { nhost } from '../../@shared/global';
import * as Query from '../../@shared/queries';

export interface DialogData {
  details: {};
}

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {

  public offerDetailsList: any;

  constructor(
    public elRef: ElementRef,
    public dialog: MatDialog

  ) { }

  async ngOnInit() {
    this.getOfferDetails()
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(OfferDetailDialogue, {
      width: '500px',
      data: { details: (typeof (item) !== 'number' ? item : {}) },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.mappedServiceId(result);
      if (result.id) {
        const { data, error } = await nhost.graphql.request(Query.UpdateOfferDetails(result.id, result))
        if (data) {
          // console.log(data);
        }
      } else if (!result.id) {
        const { data, error } = await nhost.graphql.request(Query.InsertOfferDetails(result))
        if (data) {
          // console.log(data);
        }
      }
    });
  }
  async getOfferDetails() {
    const { data, error } = await nhost.graphql.request(Query.getOfferDetails)
    if (data) {
      this.offerDetailsList = [...(data.offers)];
    }
  }

  async mappedServiceId(result) {
    const { data, error } = await nhost.graphql.request(Query.serviceDetailsList);
    if (data) {
      data.service_details.map(res => {
        if (res.name === result.service_detail.name) {
          result.service_detail.sid = res.sid;
          return result;
        }
        else {
          console.log("error")
        }
      })
    }

  }

}

@Component({
  selector: 'offer-detail-dialogue',
  templateUrl: 'offer-detail-dialogue.html',
})

export class OfferDetailDialogue {
  constructor(
    public dialogRef: MatDialogRef<OfferDetailDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  serviceData: any;
  serviceDetailsList

  async ngOnInit() {
    this.serviceDetailsList = await nhost.graphql.request(Query.serviceDetailsList);
    this.serviceData = this.data.details
  }

  async onClick() {
    this.dialogRef.close();
  }
}