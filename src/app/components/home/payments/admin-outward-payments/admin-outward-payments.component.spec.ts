import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOutwardPaymentsComponent } from './admin-outward-payments.component';

describe('AdminOutwardPaymentsComponent', () => {
  let component: AdminOutwardPaymentsComponent;
  let fixture: ComponentFixture<AdminOutwardPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOutwardPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminOutwardPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
