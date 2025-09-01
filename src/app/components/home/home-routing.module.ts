import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FamilyDetailsComponent } from './family-management/family-details/family-details.component';
import { AdminPaymentsComponent } from './payments/admin-payments/admin-payments.component';
import { UserPaymentsComponent } from './payments/user-payments/user-payments.component';
import { UserOutwardPaymentsComponent } from './payments/user-outward-payments/user-outward-payments.component';
import { AdminOutwardPaymentsComponent } from './payments/admin-outward-payments/admin-outward-payments.component';

const routes: Routes = [
  { path: '', component: DashboardContentComponent },
  { path: 'dashboardPage', component: DashboardContentComponent },
  { path: 'family', component: FamilyDetailsComponent },
  { path: 'payments', component: AdminPaymentsComponent },
  { path: 'makePayment', component: UserPaymentsComponent },
  { path: 'outwardPayments', component: UserOutwardPaymentsComponent },
  { path: 'viewOutwardPayments', component: AdminOutwardPaymentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
