import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss'
})
export class DashboardContentComponent implements OnInit {

  isAdmin = false;

  totalCollections: number = 0;
  totalExpenses: number = 0;
  pendingPayments: number = 0;
  bookings: number = 4;
  fines: number = 0;


  viewSelection?: string = 'y';

  monthlyData = [6700, 39000, 8900, 700];
  yearlyData = [65000, 59000, 55000, 44000, 56000, 55000, 40000, 50000, 0, 70000, 40000, 55000];

  monthlyChartLabel = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  yearlyChartLabel = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



  // Chart.js configuration
  lineChartData: any[] = [];
  lineChartLabels: string[] = [];
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
      bar: { backgroundColor: '#ffd500ff' }
    }
  };
  lineChartLegend = true;


  constructor(public sharedService: SharedService) {
    this.isAdmin = this.sharedService.isAdminUser();
    this.updateChart();
  }

  updateChart() {
    if (this.viewSelection === 'm') {
      this.lineChartData = [{ data: this.monthlyData, label: 'Total Payments in Rupees' }];
      this.lineChartLabels = this.monthlyChartLabel;
    } else {
      this.lineChartData = [{ data: this.yearlyData, label: 'Total Payments in Rupees' }];
      this.lineChartLabels = this.yearlyChartLabel;
    }
    this.rollDigits();
  }

  changeButton(value: string) {
    this.viewSelection = value;
    this.updateChart();
  }


  ngOnInit(): void {
  }

  rollDigits() {
    const duration = 1000;
    const steps = 60;
    const intervalTime = duration / steps;

    let collectionsTarget = 245680;
    let expensesTarget = 70450;
    let paymentsTargetAdmin = 75200;
    let paymentsTargetUser = 2450;
    let finesTarget = this.isAdmin ? 5600 : 0;

    let collectionsStep = collectionsTarget / steps;
    let expensesStep = expensesTarget / steps;
    let paymentsStep = this.isAdmin ? paymentsTargetAdmin / steps : paymentsTargetUser / steps;
    let finesStep = finesTarget / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (this.isAdmin) {
        this.totalCollections = Math.floor(collectionsStep * currentStep);
        this.pendingPayments = Math.floor(paymentsStep * currentStep);
        this.fines = Math.floor(finesStep * currentStep);
      } else {
        this.totalExpenses = Math.floor(expensesStep * currentStep);
        this.pendingPayments = Math.floor(paymentsStep * currentStep);
        this.fines = Math.floor(finesStep * currentStep);
      }

      if (currentStep >= steps) {
        if (this.isAdmin) {
          this.totalCollections = collectionsTarget;
          this.pendingPayments = paymentsTargetAdmin;
          this.fines = finesTarget;
        } else {
          this.totalExpenses = expensesTarget;
          this.pendingPayments = paymentsTargetUser;
          this.fines = finesTarget;
        }
        clearInterval(interval);
      }
    }, intervalTime);
  }



}
