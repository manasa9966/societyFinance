import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

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
    return this.db.list('families').push(family);
  }

  getFamilies() {
    return this.db.list('families').valueChanges();
  }
}
