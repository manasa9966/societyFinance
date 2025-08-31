import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { Family } from '../../../../interfaces/families';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrl: './user-payments.component.scss'
})
export class UserPaymentsComponent implements OnInit {

  loading = false;
  loaderText = '';
  familyDetails: Family[] = [];
  maintenanceList: any[] = [];
  expandedIndex: number | null = null;
  userPayments: any[] = [];

  constructor(
    public sharedService: SharedService,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMaintenanceDues();
  }

  getMaintenanceDues() {
    this.loading = true;
    this.loaderText = 'Fetching Data...';

    this.sharedService.getFamilies().subscribe((families) => {
      this.familyDetails = families.filter((f: any) =>
        f.email === this.sharedService.getUser()?.email
      ) as Family[];

      if (this.familyDetails.length > 0) {
        const familyId = this.familyDetails[0].id;

        this.sharedService.getAssignedMaintenance(familyId as string).subscribe((entries: any[]) => {
          this.maintenanceList = entries.map(entry => {
            const dueDate = new Date(entry.dueDate);
            const today = new Date();
            const daysOverdue = Math.floor((+today - +dueDate) / (1000 * 60 * 60 * 24));
            const fine = daysOverdue > 0 ? 100 : 0;

            const form = this.fb.group({
              amount: [{ value: entry.amount + fine, disabled: true }, Validators.required],
              cardNumber: ['', Validators.required],
              cardName: ['', Validators.required],
              expiry: ['', Validators.required],
              cvv: ['', Validators.required],
              terms: [false, Validators.requiredTrue]
            });

            return {
              ...entry,
              familyId,
              form
            };
          });

          // Fetch payments if at least one maintenance is PAID
          if (this.maintenanceList.some(m => m.status === 'PAID')) {
            this.fetchUserPayments(familyId  as string);
          }

          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

fetchUserPayments(familyId: string) {
  this.userPayments = [];
  this.db.list(`payments/${familyId}`).snapshotChanges().subscribe(monthSnaps => {
    this.userPayments = [];

    monthSnaps.forEach(monthSnap => {
      const monthKey = monthSnap.key;
      const monthData = monthSnap.payload.val();

      if (monthData && typeof monthData === 'object') {
        Object.values(monthData).forEach((payment: any) => {
          this.userPayments.push({ ...payment, monthKey });
        });
      }
    });

    console.log(this.userPayments);
  });
}


  

  togglePanel(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  numberOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  async onSubmit(due: any) {
    this.loading = true;
    this.loaderText = 'Processing...';

    try {
      await this.makePayment(due);
      this.snackBar.open('Payment Successful!', 'Close', { duration: 3000 });
      due.status = 'PAID';
    } catch (error) {
      console.error(error);
      this.snackBar.open('Payment Failed!', 'Close', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async makePayment(due: any) {
    const today = new Date();
    const monthKey = `month_${today.getFullYear()}_${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const familyId = due.familyId;
    const maintenanceKey = due.key || due.id;

    const counterRef = this.db.object('paymentCounter');
    const result = await counterRef.query.ref.transaction(current => (current || 0) + 1);

    if (result.committed) {
      const newCounter = result.snapshot.val();
      const paymentId = `PAYMENT_${String(newCounter).padStart(3, '0')}`;

      await this.db.list(`payments/${familyId}/${monthKey}`).push({
        paymentId,
        paidAmount: due.amount,
        paidOn: today.toISOString(),
        lateFee: due.form.get('amount')?.value - due.amount,
        status: 'PAID'
      });

      await this.db.object(`maintenance/${familyId}/${monthKey}/${maintenanceKey}/status`).set('PAID');
    }
  }

  paymentMonthYear(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}
}
