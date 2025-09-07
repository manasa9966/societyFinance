import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportYearlyOverviewComponent } from './report-yearly-overview.component';

describe('ReportYearlyOverviewComponent', () => {
  let component: ReportYearlyOverviewComponent;
  let fixture: ComponentFixture<ReportYearlyOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportYearlyOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportYearlyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
