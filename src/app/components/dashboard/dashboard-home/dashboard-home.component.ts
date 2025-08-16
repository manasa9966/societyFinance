import { Component, inject, OnInit } from '@angular/core';
import { Auth, User, signOut } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // get the user from the route (which is injected by the UserResolver)
  user: User = this.activatedRoute.snapshot.data['user'];

  // get the auth service
  auth = inject(Auth);

  displayName = '';


  constructor() { 
    this.displayName = this.user.email ? this.user.email.split('@')[0] : 'User';
  }

  ngOnInit(): void {

  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/auth/login']);
    }).catch((error: any) => {
      console.error('Error occurred:', error);
    })
    console.log('User logged out');
  }

}
