import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FamilyDetailsComponent } from './family-management/family-details/family-details.component';
import { AddFamilyComponent } from './family-management/add-family/add-family.component';


@NgModule({
  declarations: [
    DashboardContentComponent,
    FamilyDetailsComponent,
    AddFamilyComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BaseChartDirective,
    HomeRoutingModule
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
  ],
})
export class HomeModule { }
