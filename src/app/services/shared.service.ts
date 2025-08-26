import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userData: any;
  constructor(private db: AngularFireDatabase) { }

  setUser(user: any) {
    this.userData = user;
  }

  getUser() {
    return this.userData;
  }

  isAdminUser(): boolean {
    return this.userData && this.userData.email && this.userData.email.startsWith('admin');
  }

  clearUser() {
    this.userData = null;
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
}
