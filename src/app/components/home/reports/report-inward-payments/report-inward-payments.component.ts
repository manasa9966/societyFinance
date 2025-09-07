import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MonthPayments, PaymentsDataset } from '../../../../interfaces/inwardPayments';

@Component({
  selector: 'inward-payments',
  templateUrl: './report-inward-payments.component.html',
  styleUrl: './report-inward-payments.component.scss'
})

export class ReportInwardPaymentsComponent implements OnInit {
  loading!: boolean; 
  loaderText: string = 'Loading...';
  userPayments: any[] = [];
  monthlyData = [6700, 39000, 8900, 700];
  yearlyData: number[] = [];
  yearlyChartLabel = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Chart.js configuration
  lineChartData: any[] = [];
  lineChartLabels: string[] = [];
  lineChartPlugins = [];
  lineChartOptions = {
    responsive: true,
    elements: {
      line: {
        borderColor: '#f30aefff',
        borderWidth: 2,
        tension: 0
      },
      point: {
        backgroundColor: '#007bff',
        radius: 5
      },
      bar: { backgroundColor: '#eb880eff' },
    }
  };
  lineChartLegend = true;


  constructor(public sharedService: SharedService, private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.fetchAllPayments();
    this.fetchAllPaymentsInMonth();
  }

  updateChart() {
    this.lineChartData = [{ data: this.yearlyData, label: 'Total Payments in Rupees' }];
    this.lineChartLabels = this.yearlyChartLabel;
  }

  fetchAllPayments() {
    this.loading = true;
    this.yearlyData = Array(12).fill(0);
    this.sharedService.getAllInwardPayments().subscribe(payments => {
      this.yearlyData = this.getMonthlyTotals(payments);
      this.updateChart();
    });
  }

  getMonthlyTotals(data: PaymentsDataset): number[] {
    const monthTotals: number[] = new Array(12).fill(0);

    data.forEach(recordObj => {
      Object.entries(recordObj).forEach(([key, value]) => {
        if (!key.startsWith("month_")) return;

        const match = key.match(/month_(\d{4})_(\d{2})/);
        if (!match) return;

        const monthIndex = parseInt(match[2], 10) - 1;

        const paymentsObj = value as unknown as MonthPayments;
        Object.values(paymentsObj).forEach(payment => {
          monthTotals[monthIndex] += payment.paidAmount || 0;
        });
      });
    });

    return monthTotals;
  }

  fetchAllPaymentsInMonth() {
    this.loading = true;
    this.userPayments = [];
    const now = new Date();
    const monthKey = `month_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;

    this.sharedService.getFamilies().subscribe(families => {
      families.forEach((family: any, idx, arr) => {
        const familyId = family.id;
        this.db.object(`payments/${familyId}/${monthKey}`).valueChanges().subscribe(monthData => {
          if (monthData && typeof monthData === 'object') {
            Object.values(monthData).forEach((payment: any) => {
              this.userPayments.push({ ...payment, familyId, familyName: family.familyName, flatNumber: family.flatNumber, monthKey });
            });
          }
          console.log('Inward payments', this.userPayments);
        });
      });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
    
  }
}
