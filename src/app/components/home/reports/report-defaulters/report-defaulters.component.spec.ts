import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDefaultersComponent } from './report-defaulters.component';

describe('ReportDefaultersComponent', () => {
  let component: ReportDefaultersComponent;
  let fixture: ComponentFixture<ReportDefaultersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportDefaultersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportDefaultersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
