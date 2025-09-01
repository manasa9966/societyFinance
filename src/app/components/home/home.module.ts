import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FamilyDetailsComponent } from './family-management/family-details/family-details.component';
import { AddFamilyComponent } from './family-management/add-family/add-family.component';
import { AdminPaymentsComponent } from './payments/admin-payments/admin-payments.component';
import { UserPaymentsComponent } from './payments/user-payments/user-payments.component';
import { AdminOutwardPaymentsComponent } from './payments/admin-outward-payments/admin-outward-payments.component';
import { UserOutwardPaymentsComponent } from './payments/user-outward-payments/user-outward-payments.component';


@NgModule({
  declarations: [
    DashboardContentComponent,
    FamilyDetailsComponent,
    AddFamilyComponent,
    AdminPaymentsComponent,
    UserPaymentsComponent,
    AdminOutwardPaymentsComponent,
    UserOutwardPaymentsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    HomeRoutingModule,
],
  providers: [
    provideCharts(withDefaultRegisterables()),
  ],
})
export class HomeModule { }
