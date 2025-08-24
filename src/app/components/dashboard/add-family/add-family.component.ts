import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.component.html',
  styleUrl: './add-family.component.scss'
})
export class AddFamilyComponent implements OnInit {
  familyForm!: FormGroup;

  loader: boolean = false;
  loaderText = '';
  showEndTime = false;
  showUPI = true;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<AddFamilyComponent>,
    @Inject(MAT_DIALOG_DATA) public sentData: any
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

    initializeForm() {
    this.familyForm = this.fb.group({
      familyName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      familyMembers: ['', [Validators.required, Validators.min(0)]],
      flatNumber: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.familyForm.valid) {
      this.sharedService.addFamily(this.familyForm.value)
        .then(() => {
          alert('Family added successfully!');
          this.familyForm.reset();
          this.dialogRef.close();
        })
        .catch(error => {
          alert('Error adding family: ' + error);
        });
    }
  }


}
