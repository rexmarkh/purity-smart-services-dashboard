import { Component, OnInit, Input } from '@angular/core';
import { nhost } from '../../@shared/global';

@Component({
  selector: 'app-service-card-widget',
  templateUrl: './service-card-widget.component.html',
  styleUrls: ['./service-card-widget.component.scss']
})
export class ServiceCardWidgetComponent implements OnInit {
  @Input() public service: any;
  constructor() {
  }

  ngOnInit(): void {
  }

  getRoundOffValue(decimalValue: any) {
    return Math.ceil(decimalValue);
  }

  getDocumentUrl(id: any) {
    const url = nhost.storage.getPublicUrl({
      fileId: `${id}`
    })
    return url;
  }

}
