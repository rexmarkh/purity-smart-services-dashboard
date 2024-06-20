import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { nhost } from '../../@shared/global';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from '../../pages/login-modal/login-modal.component';
import { BookAServiceModalComponent } from '../../pages/book-a-service-modal/book-a-service-modal.component';
import { SharedService } from 'src/app/@shared/shared.service';
@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {
  public user: any;
  public phone: any;
  public nhost = nhost;
  public otp: any;
  public hasRequestedOTP = false;
  public closeResult: string;
  
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if ((sessionStorage.getItem("isLogin") !== 'true') && window.location.pathname.indexOf('privacy-policy') < 1) {
      this.router.navigateByUrl('/login');
    }
  
    this.sharedService.userData.subscribe(res => {
      this.user = res;
    });

    setTimeout(() => {
      this.sharedService.userData.next(nhost.auth.getUser());
    }, 500);
  }

 

  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
      } else {
          return  `with: ${reason}`;
      }
  }

 
  openModal() {
		const modalRef = this.modalService.open(LoginModalComponent, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    })
		// modalRef.componentInstance.name = 'World';
	}

  openBookaServiceModal() {
    const modalRef = this.modalService.open(BookAServiceModalComponent, { windowClass: 'modal-mini', size: 'sm', centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    })
  }
}
