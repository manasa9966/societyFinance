import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Defaulter, Family } from '../../../../interfaces/families';
import { MatDialog } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  totalDefaulters: number = 0;
  totalAmountDue: number = 0;

  displayedColumns: string[] = ['flatNumber', 'familyName', 'amount', 'daysOverdue', 'status', 'actions'];
  dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public sharedService: SharedService,
    private fb: FormBuilder,
    private dialog: MatDialog
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
            daysOverdue: daysOverdue > 0 ? daysOverdue : 0
          };
        });
        this.totalDefaulters = this.defaulters.length;
        this.totalAmountDue = this.defaulters.reduce((sum, defaulter) => sum + defaulter.amount, 0);
        this.dataSource = new MatTableDataSource(this.defaulters);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 1000);
        this.loading = false;
      });
    });
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
}
