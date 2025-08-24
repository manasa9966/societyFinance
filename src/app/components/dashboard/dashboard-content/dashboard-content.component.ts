import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss'
})
export class DashboardContentComponent implements OnInit {

  isAdmin = false;

  totalCollections: string = '₹2,45,680';
  totalExpenses: string = '₹70,450';
  pendingPayments: string;
  bookings: number = 4;
  fines: string;


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
      }
    }
  };
  lineChartLegend = true;


  constructor(public  sharedService: SharedService) { 
    this.isAdmin = this.sharedService.isAdminUser();
    if(this.isAdmin) {
      this.pendingPayments = '₹75,200'; 
      this.fines = '₹5,600';
    } else {
      this.pendingPayments = '₹2,450';   
      this.fines = '₹0';
    }
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
  }

  changeButton(value: string) {
    this.viewSelection = value;
    this.updateChart();
  }


  ngOnInit(): void {
  }


}
