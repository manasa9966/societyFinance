import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FamilyDetailsComponent } from './family-details/family-details.component';


const routes: Routes = [
  { path: '', component: DashboardHomeComponent },
  { path: 'dashboardPage', component: DashboardContentComponent },
  { path: 'family', component: FamilyDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
