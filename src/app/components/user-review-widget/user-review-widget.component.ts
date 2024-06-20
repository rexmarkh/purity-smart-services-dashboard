import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-review-widget',
  templateUrl: './user-review-widget.component.html',
  styleUrls: ['./user-review-widget.component.scss']
})
export class UserReviewWidgetComponent implements OnInit {
  @Input() public userReviews: any;
  constructor() { }

  ngOnInit(): void {
    // console.log('review :', this.userReviews);
  }

  getRoundOffValue(decimalValue: any) {
    return Math.ceil(decimalValue);
  }

}
