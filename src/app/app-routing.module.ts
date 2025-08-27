import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserResolver } from './guards/userResolvers';
import { CustomAuthGuard } from './guards/auth.guard';
import { Auth } from '@angular/fire/auth';

const redirectToLogin = () => redirectUnauthorizedTo('/auth/login');

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  {
    path: 'auth',
    loadChildren: () => import('./components/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectToLogin
    },
    resolve: {
      user: UserResolver
    }
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
