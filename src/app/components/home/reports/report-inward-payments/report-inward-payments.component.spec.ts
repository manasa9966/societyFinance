import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInwardPaymentsComponent } from './report-inward-payments.component';

describe('ReportInwardPaymentsComponent', () => {
  let component: ReportInwardPaymentsComponent;
  let fixture: ComponentFixture<ReportInwardPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportInwardPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportInwardPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
