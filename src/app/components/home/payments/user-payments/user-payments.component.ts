import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { Family } from '../../../../interfaces/families';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrl: './user-payments.component.scss'
})
export class UserPaymentsComponent implements OnInit {

  loading = false;
  loaderText = 'Processing....'

  familyDetails: Family[] = [];
  maintenance: any;

  paymentDetailsForm!: FormGroup;

  constructor(public sharedService: SharedService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.getMaintainenceDues();
    this.initializeForm();
  }

  getMaintainenceDues() {
    this.loading = true;
    this.sharedService.getFamilies().subscribe((data) => { 
      this.familyDetails = data.filter((family: any) => family.email === this.sharedService.getUser()?.email) as Family[];
      this.sharedService.getAssignedMaintenance(this.familyDetails[0].id as string).subscribe((data) => {
        this.maintenance = data
        if(this.maintenance) {
          this.paymentDetailsForm.controls['amount'].patchValue(this.maintenance.amount)
          this.paymentDetailsForm.controls['amount'].disable();
        }
        this.loading = false;
      })
    });
  }

  initializeForm() {
    this.paymentDetailsForm = this.fb.group({
      amount: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cardName: ['', Validators.required],
      expiry: ['', Validators.required],
      cvv: ['', Validators.required],
      terms: [false, Validators.required]
    });
  }

  onSubmit() {
    this.sharedService.makePayment(this.familyDetails[0].id as string, this.maintenance.amount)
  }





}
