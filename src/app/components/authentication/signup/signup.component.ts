import { Component, inject, OnInit } from '@angular/core';
import { Auth, AuthErrorCodes, createUserWithEmailAndPassword, GoogleAuthProvider,  } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
   loginForm!: FormGroup;
 
   googleAuthProvider = new GoogleAuthProvider();
 
   auth = inject(Auth);
 
   errorMessage: string = '';
   showError = false;

  constructor(private fb: FormBuilder, public router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onSignUp() {
    createUserWithEmailAndPassword(this.auth, this.loginForm.value.email, this.loginForm.value.password).then((res) => {
     this.gotoDashboard();
    }).catch((error) => {
      if (error instanceof Error) {
        this.showError = true;
        if (error.message.includes(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)) {
          this.errorMessage = 'INVALID_LOGIN_CREDENTIALS';
        } else if (error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
          this.errorMessage = 'INVALID_EMAIL';
        } else if (error.message.includes(AuthErrorCodes.USER_DISABLED)) {
          this.errorMessage = 'USER_DISABLED';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }

  onLoginRedirect() {
    this.router.navigate(['auth/login']);
  }

  gotoDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
