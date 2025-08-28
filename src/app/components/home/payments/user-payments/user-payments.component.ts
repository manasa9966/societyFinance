import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { Family } from '../../../../interfaces/families';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrl: './user-payments.component.scss'
})
export class UserPaymentsComponent implements OnInit {

  loading = false;
  loaderText = '';

  familyDetails: Family[] = [];
  maintenance: any;
  daysOverdue: number = 0;
  paymentScreen = false;

  paymentDetailsForm!: FormGroup;


  constructor(public sharedService: SharedService, private fb: FormBuilder, private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.getMaintainenceDues();
    this.initializeForm();
  }

  getMaintainenceDues() {
    this.loading = true;
    this.loaderText = 'Fetching Data....';
    this.sharedService.getFamilies().subscribe((data) => {
      this.familyDetails = data.filter((family: any) => family.email === this.sharedService.getUser()?.email) as Family[];
      this.sharedService.getAssignedMaintenance(this.familyDetails[0].id as string).subscribe((data) => {
        this.maintenance = data
        if (this.maintenance) {
          const dueDate = new Date(this.maintenance.dueDate);
          const today = new Date();
          this.daysOverdue = Math.floor((+today - +dueDate) / (1000 * 60 * 60 * 24));
          const fine = this.daysOverdue > 0 ? 100 : 0;
          this.paymentDetailsForm.controls['amount'].patchValue(this.maintenance.amount + fine)
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

  numberOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  onSubmit() {
    this.loading = true;
    this.loaderText = 'Processing.... Please wait'
    this.makePayment(this.familyDetails[0].id as string, this.maintenance.amount)
  }

  makePayment(familyId: string, amount: number) {
    const today = new Date();
    const monthKey = `month_${today.getFullYear()}_${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 10);

    let lateFee = 0;
    if (today > dueDate) {
      lateFee = 100;
    }

    const counterRef = this.db.object('paymentCounter');

    counterRef.query.ref.transaction((currentValue) => {
      const newValue = (currentValue || 0) + 1;
      return newValue;
    }).then((result) => {
      if (result.committed) {
        const newCounter = result.snapshot.val();
        const paymentId = `PAYMENT_${String(newCounter).padStart(3, '0')}`;
        this.db.object(`payments/${familyId}/${monthKey}`).set({
          paymentId,
          paidAmount: amount,
          paidOn: today.toISOString(),
          lateFee,
          status: 'PAID'
        });

        this.db.object(`maintenance/${familyId}/${monthKey}/status`).set('PAID');
        this.loading = false;
      }
    });
  }






}
