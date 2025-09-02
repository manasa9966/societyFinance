import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import emailjs from 'emailjs-com'; // Add this import
import e from 'express';
import { emailEnviorment } from '../../environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient,
    private storage: AngularFireStorage // Add this if not present
  ) { }

  setUser(user: User) {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }

  isUserLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  isAdminUser(): boolean {
    return this.userSubject.value?.email?.includes('admin') || false;
  }

  //Famillies

  addFamily(family: any) {
    family.createdAt = new Date().toISOString();
    family.isActive = true;
    return this.db.list('families').push(family);
  }

  getFamilies() {
    return this.db.list('families').snapshotChanges().pipe(
      map(actions => actions.map(action => ({
        id: action.key,
        ...action.payload.val() as object
      })))
    );
  }

  updateFamily(id: string, updatedData: any): Promise<void> {
    if (!id) {
      return Promise.reject('Family ID is missing');
    }
    return this.db.object(`families/${id}`).set(updatedData);
  }

  deleteFamily(key: string) {
    return this.db.list('families').remove(key);
  }

  //Payments

  setMaintenance(familyId: string, amount: number) {
    const now = new Date();
    const monthKey = `month_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return this.db.list(`maintenance/${familyId}/${monthKey}`).push({
      amount,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
      status: 'PENDING'
    });
  }

  getDefaulters() {
    return this.db.list('maintenance').snapshotChanges().pipe(
      map(actions => {
        let defaulters: any[] = [];
        const now = new Date();
        const monthKey = `month_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        actions.forEach(action => {
          const familyId = action.key;
          const data = action.payload.val() as any;
          if (data && data[monthKey]) {
            Object.entries(data[monthKey]).forEach(([entryKey, entryValue]: [string, any]) => {
              if (entryValue?.status?.toUpperCase() === 'PENDING') {
                defaulters.push({ familyId, entryKey, ...entryValue });
              }
            });
          }
        });
        return defaulters;
      })
    );
  }

  getAssignedMaintenance(familyId: string) {
    const now = new Date();
    const monthKey = `month_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return this.db.list(`maintenance/${familyId}/${monthKey}`)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(action => ({
          key: action.key,
          ...action.payload.val() as object
        })))
      );
  }

  makePayment(familyId: string, amount: number) {
    const today = new Date();
    const monthKey = `month_${today.getFullYear()}_${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    const dueDate = new Date(today.getFullYear(), today.getMonth(), 10);

    let lateFee = 0;
    if (today > dueDate) {
      lateFee = 100;
    }

    const counterRef = this.db.object('paymentCounter');

    counterRef.query.ref.transaction((currentValue) => {
      const newValue = (currentValue || 0) + 1;
      return newValue;
    }).then((result) => {
      if (result.committed) {
        const newCounter = result.snapshot.val();
        const paymentId = `PAYMENT_${String(newCounter).padStart(3, '0')}`;
        this.db.object(`payments/${familyId}/${monthKey}`).set({
          paymentId,
          paidAmount: amount,
          paidOn: today.toISOString(),
          lateFee,
          status: 'PAID'
        });

        this.db.object(`maintenance/${familyId}/${monthKey}/status`).set('PAID');
      }
    });
  }

  //Reminder Email

  sendReminderViaEmailJS(data: {
    ownerName: string;
    flatNumber: string;
    amountDue: number;
    month: string;
    dueDate: string;
    paymentLink: string;
    ownerEmail: string;
  }): Promise<any> {
    return emailjs.send(
      emailEnviorment.emai.serviceId,
      emailEnviorment.emai.templateId,
      data,
      emailEnviorment.emai.apiKey
    );
  }

  // Outward Payments

  async createOutwardPayment(
    data: any,
    file: File,
    name: string,
    families: any[],
    userEmail: string
  ): Promise<void> {
    const filePath = `invoices/${Date.now()}_${name}`;
    const fileRef = this.storage.ref(filePath);
    // Find familyId by user email
    const family = families.find(fam => fam.email === userEmail);
    const familyId = family ? family.id : null;

    // Push to DB
    const paymentId = this.db.createPushId();
    await this.db.object(`outwardPayments/${paymentId}`).set({
      createdBy: familyId,
      createdAt: new Date().toISOString(),
      vendorName: data.vendorName,
      description: data.description,
      amount: data.invoiceAmount,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate,
      fileName: `invoices/${Date.now()}_${name}`,
      status: "PENDING",
      checker: { checkerId: "", checkedAt: "" },
      notes: data.notes || ""
    });
  }

  getAllOutwardPayments(): Observable<any[]> {
    return this.db.list('outwardPayments').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          id: c.payload.key,
          ...c.payload.val() as object
        }))
      )
    );
  }

  approvePayment(familyId: string, paymentId: string): Promise<void> {
    const checkerId = familyId;
    return this.db.object(`outwardPayments/${paymentId}`).update({
      status: "APPROVED",
      "checker/checkerId": checkerId,
      "checker/checkedAt": new Date().toISOString()
    });
  }

  rejectPayment(familyId: string, paymentId: string, notes?: string): Promise<void> {
    const checkerId = familyId;
    return this.db.object(`outwardPayments/${paymentId}`).update({
      status: "REJECTED",
      "checker/checkerId": checkerId,
      "checker/checkedAt": new Date().toISOString(),
    });
  }

}
