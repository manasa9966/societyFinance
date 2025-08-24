import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FamilyDetailsComponent } from './family-details/family-details.component';
import { AddFamilyComponent } from './add-family/add-family.component';


@NgModule({
  declarations: [
    DashboardHomeComponent,
    DashboardContentComponent,
    FamilyDetailsComponent,
    AddFamilyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    BaseChartDirective,
  ], 
    providers: [
    provideCharts(withDefaultRegisterables()),
  ],
})
export class DashboardModule { }
