import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AddFamilyComponent } from '../add-family/add-family.component';
import { Family } from '../../../interfaces/families';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrl: './family-details.component.scss'
})
export class FamilyDetailsComponent implements OnInit {

  families: Family[] = [];
  loding: boolean = false;
  loaderText: string = 'Loading... Please wait';

  constructor(public sharedService: SharedService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getFamilies();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddFamilyComponent, {
      width: '65rem',
      height: '85vh',
      panelClass: 'custom-modalbox',
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFamilies();
      console.log('The dialog was closed');
    });
  }

  getFamilies() {
    this.loding = true;
    this.sharedService.getFamilies().subscribe((data) => {
      if (this.sharedService.isAdminUser()) {
        this.families = data as Family[];
      } else {
        this.families = data.filter((family: any) => family.email === this.sharedService.getUser().email) as Family[];
      }
      console.log(this.families);
      this.loding = false;
    });
  }

  editFamilyDetails(details: Family) {
    const dialogRef = this.dialog.open(AddFamilyComponent, {
      width: '65rem',
      height: '85vh',
      panelClass: 'custom-modalbox',
      data: {
        familyData: details,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getFamilies();
      console.log('The dialog was closed');
    });
  }

  deleteFamily(data: Family) {
    if (confirm('Are you sure you want to delete this family?')) {
      const key = data.id as string;
      this.sharedService.deleteFamily(key)
        .then(() => {
          alert('Family deleted successfully!');
          this.getFamilies();
        })
        .catch(error => {
          alert('Error deleting family: ' + error);
        });
    }
  }

}
