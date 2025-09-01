import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOutwardPaymentsComponent } from './user-outward-payments.component';

describe('UserOutwardPaymentsComponent', () => {
  let component: UserOutwardPaymentsComponent;
  let fixture: ComponentFixture<UserOutwardPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserOutwardPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserOutwardPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
