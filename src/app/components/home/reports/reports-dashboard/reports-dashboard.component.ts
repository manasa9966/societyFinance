import { Component } from '@angular/core';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss'
})
export class ReportsDashboardComponent {
  loading = false;
  loaderText = 'Loading reports...';

  constructor() { }

}
