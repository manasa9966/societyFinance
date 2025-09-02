import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { Family } from '../../../../interfaces/families';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Complaint } from '../../../../interfaces/complaint';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.scss'
})
export class ComplaintsComponent implements OnInit {

  families: Family[] = [];
  loaderText = 'Loading Details...';
  loding = false;
  complaintsForm!: FormGroup;

  complaintsList: Complaint[] = [];

  constructor(public sharedService: SharedService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loding = true;
    this.initializeForm();
    this.sharedService.getFamilies().subscribe(families => {
      this.families = families as Family[];
      this.sharedService.getComplaints().subscribe(complaints => {
        this.complaintsList = (complaints as Complaint[]).map(comp => {
          const family = this.families.find(fam => fam.flatNumber === comp.flatNumber);

          return {
            ...comp,
            familyName: family ? family.familyName : 'Unknown',
            flatNumber: family ? family.flatNumber : 'Unknown',
          };
        });
      });
      this.loding = false;
    });
  }

  initializeForm() {
    this.complaintsForm = this.fb.group({
      flatNumber: ['', Validators.required],
      complaintTitle: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    this.loding = true;
    if (this.complaintsForm.valid) {
      this.sharedService.submitComplaint(this.complaintsForm.value).then(() => {
        this.complaintsForm.reset();
        this.loding = false;
        alert('Complaint submitted successfully!');
      }, () => {
        this.loding = false;
        alert('Error submitting complaint.');
      });
    }
  }

}
