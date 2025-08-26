import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FamilyDetailsComponent } from './family-management/family-details/family-details.component';

const routes: Routes = [
    { path: '', component: SideNavComponent },
    { path: 'dashboardPage', component: DashboardContentComponent },
    { path: 'family', component: FamilyDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
