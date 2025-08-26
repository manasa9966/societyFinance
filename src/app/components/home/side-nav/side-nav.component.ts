import { Component, inject } from '@angular/core';
import { SideNavItem } from '../../../interfaces/sideNav';
import { adminMenu, userMenu } from '../../../constants/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, signOut, User } from '@angular/fire/auth';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
sideNavList: SideNavItem[] = adminMenu

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // get the user from the route (which is injected by the UserResolver)
  user: User = this.activatedRoute.snapshot.data['user'];

  // get the auth service
  auth = inject(Auth);

  displayName = '';
  pageName: string = 'dashboardPage';

  isAdmin = false;


  constructor(private sharedService: SharedService) { 
    this.sharedService.setUser(this.user);
    this.displayName = this.user.email ? this.user.email.split('@')[0] : 'User';
    this.isAdmin = this.sharedService.isAdminUser();

    if (!this.isAdmin) {
      this.sideNavList = userMenu;
    } else {
      this.sideNavList = adminMenu;
    }
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.sharedService.clearUser();
      this.router.navigate(['/auth/login']);
    }).catch((error: any) => {
      console.error('Error occurred:', error);
    })
    console.log('User logged out');
  }

  nagigateToPage(page: string): void {
    this.pageName = page;
  }
}
