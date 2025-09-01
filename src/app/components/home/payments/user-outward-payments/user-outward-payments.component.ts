import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-user-outward-payments',
  templateUrl: './user-outward-payments.component.html',
  styleUrls: ['./user-outward-payments.component.scss']
})
export class UserOutwardPaymentsComponent implements OnInit {
  loading = false;
  loaderText = 'Loading...';

  outwardPaymentForm!: FormGroup;
  selectedFile: File | null = null;

  today: Date = new Date();
  fileName: string = '';

  constructor(private fb: FormBuilder, private storage: AngularFireStorage, private db: AngularFireDatabase, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.outwardPaymentForm = this.fb.group({
      invoiceNumber: [null, Validators.required],
      invoiceDate: [null, Validators.required],
      vendorName: [null, Validators.required],
      invoiceAmount: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: ['Online', Validators.required],
      paymentDate: [null, Validators.required],
      description: ['', Validators.required],
      notes: ['']
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  async onSubmit() {
    if (this.outwardPaymentForm.valid) {
      this.loading = true;
      const formData = { ...this.outwardPaymentForm.value };
      this.sharedService.getFamilies().subscribe(async (families) => {
        await this.sharedService.createOutwardPayment(
          formData,
          this.selectedFile as File,
          this.fileName,
          families,
          this.sharedService.getUser()?.email as string
        );
        this.outwardPaymentForm.reset();
        this.selectedFile = null;
        this.fileName = '';
        this.loading = false;
        alert('Outward payment request submitted successfully!');
      });
    } else {
      this.outwardPaymentForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.outwardPaymentForm.reset();
    this.selectedFile = null;
    this.fileName = '';
  }

  removeFile() {
    this.selectedFile = null;
    this.fileName = '';
  }
}
