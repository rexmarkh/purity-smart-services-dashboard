import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;
  public islogin = false;

  constructor(private router: Router) { }

  ngOnInit() {
    // if (sessionStorage.getItem("isLogin") == "true") {
    //   this.islogin = true;
    // } else {
    //   if (window.location.pathname.indexOf('privacy-policy') < 1) {
    //     this.router.navigateByUrl('/login');
    //   }
    // }
    const html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

  }
  ngOnDestroy() {
    const html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }
}
