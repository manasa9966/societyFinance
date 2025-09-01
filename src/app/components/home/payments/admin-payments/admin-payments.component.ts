import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Defaulter, Family } from '../../../../interfaces/families';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-admin-payments',
  templateUrl: './admin-payments.component.html',
  styleUrl: './admin-payments.component.scss'
})
export class AdminPaymentsComponent implements OnInit {

  paymentRequestForm!: FormGroup;
  loading: boolean = false;
  loaderText: string = 'Loading...';
  families: Family[] = [];
  defaulters: Defaulter[] = [];
  userPayments: any[] = [];
  totalDefaulters: number = 0;
  totalAmountDue: number = 0;

  totalInWardPayments: number = 0;
  totalLateFees: number = 0;

  displayedColumns: string[] = ['flatNumber', 'familyName', 'amount', 'daysOverdue', 'status', 'actions'];
  inwardDisplayedColumns: string[] = ['paymentId', 'flatNumber', 'familyName', 'paidOn', 'amount', 'mode', 'status'];
  dataSource!: MatTableDataSource<any>
  inWardDataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public sharedService: SharedService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private db: AngularFireDatabase,
  ) { }

  ngOnInit(): void {
    this.getFamilies();
    this.initializeForm();
  }

  getFamilies() {
    this.loading = true;
    this.sharedService.getFamilies().subscribe((data) => {
      this.families = data as Family[];

      this.sharedService.getDefaulters().subscribe((defaulters) => {
        this.defaulters = (defaulters as Defaulter[]).map(defaulter => {
          const family = this.families.find(fam => fam.id === defaulter.familyId);
          const dueDate = new Date(defaulter.dueDate);
          const today = new Date();
          const daysOverdue = Math.floor((+today - +dueDate) / (1000 * 60 * 60 * 24));

          return {
            ...defaulter,
            familyName: family ? family.familyName : 'Unknown',
            flatNumber: family ? family.flatNumber : 'Unknown',
            email: family ? family.email : 'test@gmail.com',
            daysOverdue: daysOverdue > 0 ? daysOverdue : 0
          };
        });
        this.totalDefaulters = this.defaulters.length;
        this.totalAmountDue = this.defaulters.reduce((sum, defaulter) => sum + defaulter.amount, 0);
        this.dataSource = new MatTableDataSource(this.defaulters);
        console.log('defaulters',this.defaulters);
        this.fetchAllPaymentsForAdmin();
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 1000);
      });
    });
  }

  fetchAllPaymentsForAdmin() {
    this.loading = true;
    this.userPayments = [];
    this.sharedService.getFamilies().subscribe(families => {
      families.forEach((family: any, idx, arr) => {
        const familyId = family.id;
        this.db.list(`payments/${familyId}`).snapshotChanges().subscribe(monthSnaps => {
          monthSnaps.forEach(monthSnap => {
            const monthKey = monthSnap.key;
            const monthData = monthSnap.payload.val();

            if (monthData && typeof monthData === 'object') {
              Object.values(monthData).forEach((payment: any) => {
                this.userPayments.push({ ...payment, familyId, familyName: family.familyName, flatNumber: family.flatNumber, monthKey });
              });
            }
          });

          // Only update totals and datasource after all families processed
          if (idx === arr.length - 1) {
            this.totalInWardPayments = this.userPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
            this.totalLateFees = this.userPayments.reduce((sum, payment) => sum + (payment.lateFee || 0), 0);
            this.inWardDataSource = new MatTableDataSource(this.userPayments);
            console.log('Inward payments',this.userPayments);
          }
        });
      });
    }); setTimeout(() => {
      this.inWardDataSource.paginator = this.paginator;
    }, 1000);

    this.loading = false;
  }

  initializeForm() {
    this.paymentRequestForm = this.fb.group({
      flatNumber: ['', Validators.required],
      dueAmount: ['', Validators.required],
    });
  }

  openDialog(templateRef: TemplateRef<any>) {
    this.paymentRequestForm.reset();
    this.dialog.open(templateRef, {
      width: '65rem',
      height: '60vh',
      panelClass: 'custom-modalbox',
    });
  }

  onSubmit() {
    if (this.paymentRequestForm.valid) {
      this.loading = true;
      this.loaderText = 'Submitting...';
      const familyId = this.families.find(fam => fam.flatNumber === this.paymentRequestForm.value.flatNumber)?.id;
      this.sharedService.setMaintenance(familyId as string, this.paymentRequestForm.value.dueAmount).then(() => {
        alert('Maintenance Added successfully!');
        this.paymentRequestForm.reset();
        this.dialog.closeAll();
      }).catch((error) => {
        alert('Error setting maintenance: ' + error);
      }).finally(() => {
        this.loading = false;
      });
    }
  }

  sendReminder(email: string) {
    this.loading = true;
    this.loaderText = 'Sending Reminder...';
    const data = this.defaulters.find(defaulter => defaulter.email === email) as Defaulter;
    console.log('Sending reminder to:',email, data);
    const formattedDueDate = new Date(data.dueDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const emailData = {
      ownerName: data.familyName as string,
      flatNumber: data.flatNumber as string,
      amountDue: data.amount,
      month: new Date().toLocaleString('default', { month: 'long' }),
      dueDate: data.dueDate ? formattedDueDate : 'N/A',
      paymentLink: 'www.google.com',
      ownerEmail: email,
    };

    this.sharedService.sendReminderViaEmailJS(emailData)
      .then(() => {
        this.loading = false;
        alert('Reminder sent!')
      })
      .catch(err => {
        this.loading = false;
        alert('Failed to send reminder.');
      });
  }

}
