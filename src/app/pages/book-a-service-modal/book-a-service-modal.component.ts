import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as Query from '../../@shared/queries';
import { nhost } from '../../@shared/global';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { LoginModalComponent } from '../../pages/login-modal/login-modal.component';

@Component({
  selector: 'app-book-a-service-modal',
  templateUrl: './book-a-service-modal.component.html',
  styleUrls: ['./book-a-service-modal.component.scss']
})
export class BookAServiceModalComponent implements OnInit {

  public servicesList: any;
  public selectedService: any = {
    name: null
  };
  public isSelected = false;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.getServices();
  }

  getDocumentUrl(id: any) {
    const url = nhost.storage.getPublicUrl({
      fileId: `${id}`
    })
    return url;
  }

  getServiceDetails(service) {
    this.selectedService = service;
    this.isSelected = true;
    // this.router.navigate([`user/service-details/${service.sid}`], {state: service});
  }

  async getServices() {
    const { data, error } = await nhost.graphql.request(Query.serviceDetailsList)
    if (data) {
      this.servicesList = [...(data.service_details)];
    }
  }

  close(data) {
    this.activeModal.close(data);
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
    modalRef.componentInstance.serviceDetail = this.selectedService;
  }

  bookNow() {
    if (nhost.auth.getUser()) {
        this.openBookingModal();
    } else {
      this.openLoginModal();
    }
    this.activeModal.close();
  }
}
