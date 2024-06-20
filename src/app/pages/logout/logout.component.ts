import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/@shared/shared.service';
import { nhost } from '../../@shared/global';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    public router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    nhost.auth.signOut().then(() => {
      sessionStorage.setItem("isLogin", "false");
      this.sharedService.userData.next(null);
      this.router.navigateByUrl('/user/login');
    })
  }


}
