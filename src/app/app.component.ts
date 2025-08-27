import { Component, inject, OnInit } from '@angular/core';
import { SideNavItem } from './interfaces/sideNav';
import { adminMenu, userMenu } from './constants/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, signOut, User } from '@angular/fire/auth';
import { SharedService } from './services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'society-finance';
  sideNavList: SideNavItem[] = [];
  displayName = '';
  pageName: string = 'dashboardPage';
  isAdmin = false;
  user: User | null = null;
  private userSub!: Subscription;

  auth = inject(Auth);
  private router = inject(Router);

  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.userSub = this.sharedService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.displayName = user.email ? user.email.split('@')[0] : 'User';
        this.isAdmin = this.sharedService.isAdminUser();
        this.sideNavList = this.isAdmin ? adminMenu : userMenu;
      } else {
        this.displayName = '';
        this.sideNavList = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.sharedService.clearUser();
      this.router.navigate(['/auth/login']);
    }).catch((error: any) => {
      console.error('Error occurred:', error);
    });
    console.log('User logged out');
  }

  nagigateToPage(page: string): void {
    console.log('Navigating to page:', page);
    this.pageName = page;
    this.router.navigate([page]);
  }
}
