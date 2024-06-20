import { Component, ElementRef, OnInit, Inject } from '@angular/core';
import * as Query from '../../@shared/queries';
import { nhost } from '../../@shared/global';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  details: {};
}

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {

  public serviceDetailsList: any;

  constructor(
    public elRef: ElementRef,
    public dialog: MatDialog

  ) { }

  ngOnInit() {
    this.getServiceDetailsList();
  }

  openDialog(item): void {
    const dialogRef = this.dialog.open(ServiceDetailDialogue, {
      width: '500px',
      data: { details: (typeof (item) !== 'number' ? item : {}) },
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.sid) {
        const { data, error } = await nhost.graphql.request(Query.UpdateServiceDetails(result.sid, result))
        if (data) {
          // console.log(data);
          this.ngOnInit();
        }
      } else if (!result.sid) {
        const { data, error } = await nhost.graphql.request(Query.InsertServiceDetails(result))
        if (data) {
          // console.log(data);
          this.ngOnInit();
        }
      }
    });
  }
  async getServiceDetailsList() {
    const { data, error } = await nhost.graphql.request(Query.serviceDetailsList)
    if (data) {
      this.serviceDetailsList = [...(data.service_details)];
    }
  }
}

@Component({
  selector: 'service-detail-dialogue',
  templateUrl: 'service-detail-dialogue.html',
})

export class ServiceDetailDialogue {
  constructor(
    public dialogRef: MatDialogRef<ServiceDetailDialogue>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  serviceData: any;

  ngOnInit() {
    this.serviceData = this.data.details;
  }

  async onClick() {
    this.dialogRef.close();
  }
}