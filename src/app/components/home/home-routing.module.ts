import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FamilyDetailsComponent } from './family-management/family-details/family-details.component';
import { AdminPaymentsComponent } from './payments/admin-payments/admin-payments.component';
import { UserPaymentsComponent } from './payments/user-payments/user-payments.component';

const routes: Routes = [
  { path: '', component: DashboardContentComponent },
  { path: 'dashboardPage', component: DashboardContentComponent },
  { path: 'family', component: FamilyDetailsComponent },
  { path: 'payments', component: AdminPaymentsComponent },
  { path: 'makePayment', component: UserPaymentsComponent },
  { path: 'paymentHistory', component: UserPaymentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
