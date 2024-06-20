import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ValidatorFn } from '@angular/forms';
import locations from 'src/assets/data/locality.json';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-new-address-modal',
  templateUrl: './add-new-address-modal.component.html',
  styleUrls: ['./add-new-address-modal.component.scss']
})
export class AddNewAddressModalComponent implements OnInit {
  
  public addNewAddressForm: any;
  public localities: any;
  
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.localities = locations.locations;
    this.createAddNewAddressForm();
  }

  createAddNewAddressForm() {
    this.addNewAddressForm = this.formBuilder.group({
      address_name: ['Home', [Validators.required, Validators.minLength(3)]],
      address: [ '', [Validators.minLength(3)]],
      locality: ['', [Validators.required, Validators.minLength(3)]],
      city: [{value: 'Chennai', disabled: true}, [Validators.required, Validators.minLength(3)]],
      // pincode: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]],
      is_preferred_address: [false, [Validators.required]]
    });
  }
  
  close(data) {
    this.activeModal.close(data);
  }

  onAddNewAddressFormSubmit() {
    // console.log(this.addNewAddressForm.getRawValue());
    // this.activeModal.close(this.addNewAddressForm.getRawValue());
    this.activeModal.close();
  }

}
