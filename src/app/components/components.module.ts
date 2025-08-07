import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';






@NgModule({
    declarations: [
       LoginComponent,
       DashboardComponent,
       

    ],
    imports: [
        CommonModule, 
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
       
        
    ]
})
export class ComponentsModule { }