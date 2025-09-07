import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { Defaulter, Family } from '../../../../interfaces/families';
import { MatTab } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'defaulters',
  templateUrl: './report-defaulters.component.html',
  styleUrls: ['./report-defaulters.component.scss']
})
export class ReportDefaultersComponent implements OnInit {

  totalDefaulters: number = 0;
  totalAmountDue: number = 0;
  families: Family[] = [];
  defaulters: Defaulter[] = [];
  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = ['flatNumber', 'familyName', 'amount', 'daysOverdue', 'status'];

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getFamilies();
  }

    getFamilies() {
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
        });
      });
    }

    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.defaulters);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Defaulters');
      XLSX.writeFile(workbook, 'defaulters_report.xlsx');
    }

}
