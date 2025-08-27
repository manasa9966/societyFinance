import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';
import { User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private db: AngularFireDatabase) { }

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
    return this.db.object(`maintenance/${familyId}/${monthKey}`).set({
      amount,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
      status: 'PENDING'
    });
  }

  getPayments() {
    return this.db.list('payments').valueChanges();
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
          if (data && data[monthKey]?.status?.toUpperCase() === 'PENDING') {
            defaulters.push({ familyId, ...data[monthKey] });
          }
        });
        return defaulters;
      })
    );
  }

  getAssignedMaintenance(familyId: string) {
    const now = new Date();
    const monthKey = `month_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    return this.db.object(`maintenance/${familyId}/${monthKey}`).valueChanges();
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




}
