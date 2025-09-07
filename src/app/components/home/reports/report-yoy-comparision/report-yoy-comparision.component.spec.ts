import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportYoyComparisionComponent } from './report-yoy-comparision.component';

describe('ReportYoyComparisionComponent', () => {
  let component: ReportYoyComparisionComponent;
  let fixture: ComponentFixture<ReportYoyComparisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportYoyComparisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportYoyComparisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
