import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/@shared/shared.service';
import { nhost } from '../../@shared/global';
import * as Query from '../../@shared/queries';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  @Input() name;
  public phone: any;
  public otp: any;
  public hasRequestedOTP = false;
  public showLoader = false;
  public loginForm : FormGroup;
  public showInvalidOtpError = false;

	constructor(
    public activeModal: NgbActiveModal,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  requestOTP() {
    this.showLoader = true;
    nhost.auth.signIn({ phoneNumber: `+91${this.phone}` }).then(res => {
      this.hasRequestedOTP = true;
    }).finally(() => {
      this.showLoader = false;
    });
  }

  async signIn() {
    this.showInvalidOtpError = false;
    this.showLoader = true;
    nhost.auth.signIn({ phoneNumber: `+91${this.phone}`, otp: `${this.otp}` }).then(res => {
      sessionStorage.setItem('user', JSON.stringify(res.session.user));
      this.sharedService.userData.next(res.session.user);
      this.isProfileCompleted(res.session.user.id).then(userData => {
        this.activeModal.close('Successful');
        if (userData.user_profiles.length == 0) {
          this.router.navigateByUrl('user/my-profile');
        }
      })
    }).catch(err => {
      this.showInvalidOtpError = true;
    }).finally(() => {
      this.showLoader = false;
    });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

  async isProfileCompleted(id) {
    const { data, error } = await nhost.graphql.request(Query.IsUserProfileCompleted(id));
    return data;
  }
}
