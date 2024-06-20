import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { nhost } from '../../@shared/global';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login = { username: '', password: '' };
  submitted = false;

  constructor(
    public router: Router,
    public elRef: ElementRef
  ) { }

  async ngOnInit() {
    if (nhost?.auth?.isAuthenticated() && await nhost?.auth?.getUser()?.roles.includes("admin")) {
      this.storeValuetoStorage(nhost.auth.getUser())
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  async onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      await nhost.auth.signIn({
        email: form.value.username,
        password: form.value.password
      }).then(res => {
        if (res.error) {
          this.elRef.nativeElement.querySelector(".error").innerHTML = res.error.message + "!";
        } else {
          if (res.session.user.roles.includes("admin")) {
            this.storeValuetoStorage(res.session.user)
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.elRef.nativeElement.querySelector(".error").innerHTML = "UnAuthorised User";
            return nhost.auth.signOut().then(() => {
              sessionStorage.setItem("isLogin", "false");
            })
          }
        }
      })
    }
  }
  storeValuetoStorage(res) {
    sessionStorage.setItem("isLogin", "true");
    sessionStorage.setItem("name", res.displayName);
    sessionStorage.setItem("avatar", res.avatarUrl);
  }
}
