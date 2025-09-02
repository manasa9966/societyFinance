import { Component, ViewChild } from '@angular/core';
import { Family } from '../../../../interfaces/families';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SharedService } from '../../../../services/shared.service';
import { OutwardPayment } from '../../../../interfaces/outward-payment';

@Component({
  selector: 'app-admin-outward-payments',
  templateUrl: './admin-outward-payments.component.html',
  styleUrl: './admin-outward-payments.component.scss'
})
export class AdminOutwardPaymentsComponent {

  loading: boolean = false;
  loaderText: string = 'Loading...';
  families: Family[] = [];
  outwardPaymentsList: OutwardPayment[] = [];
  totalOutwardRequests: number = 0;
  totalAmountDue: number = 0;
  totalApprovedOutwardRequests: number = 0;
  totalRejectedOutwardRequests: number = 0;

  displayedColumns: string[] = ['invoiceId', 'flatNumber', 'familyName', 'createdDate', 'amount','status', 'actions'];
  dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.getFamilies();
  }

  getFamilies() {
    this.loading = true;
    this.sharedService.getFamilies().subscribe((data) => {
      this.families = data as Family[];

      this.sharedService.getAllOutwardPayments().subscribe((payments) => {
        this.outwardPaymentsList = (payments as OutwardPayment[]).map(payment => {
          const family = this.families.find(fam => fam.id === payment.createdBy);

          return {
            ...payment,
            familyName: family ? family.familyName : 'Unknown',
            flatNumber: family ? family.flatNumber : 'Unknown',
            email: family ? family.email : 'test@gmail.com',
          };
        });
        this.totalOutwardRequests = this.outwardPaymentsList.length;
        this.totalAmountDue = this.outwardPaymentsList.reduce((sum, defaulter) => sum + defaulter.amount, 0);
        this.totalApprovedOutwardRequests = this.outwardPaymentsList.filter(payment => payment.status === 'APPROVED').length;
        this.totalRejectedOutwardRequests = this.outwardPaymentsList.filter(payment => payment.status === 'REJECTED').length;
        this.dataSource = new MatTableDataSource(this.outwardPaymentsList);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 1000);
        this.loading = false;
      });
    });
  }

  ApproveInvoice(familyId: string, id: string) {
    this.sharedService.approvePayment(familyId, id).then(() => {
      alert("Invoice Approved");
      this.getFamilies();
    });
  }

  RejectInvoice(familyId: string, id: string) {
    this.sharedService.rejectPayment(familyId, id).then(() => {
      alert("Invoice Rejected");
      this.getFamilies();
    });
  }
}
