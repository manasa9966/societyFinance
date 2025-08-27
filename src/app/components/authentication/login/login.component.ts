import { Component, inject, OnInit } from '@angular/core';
import { Auth, AuthErrorCodes, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import e from 'express';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  googleAuthProvider = new GoogleAuthProvider();

  auth = inject(Auth);

  errorMessage: string = '';
  showError = false;
  
  constructor(private fb: FormBuilder, private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onLogin() {
    signInWithEmailAndPassword(this.auth, this.loginForm.value.email, this.loginForm.value.password).then((res) => {
      this.sharedService.setUser(res.user);
      this.gotoDashboard();
    }).catch((error) => {
      if(error instanceof Error) {
        this.showError = true;
        if(error.message.includes(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)) {
          this.errorMessage = 'INVALID_LOGIN_CREDENTIALS';
        } else if(error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
          this.errorMessage = 'INVALID_EMAIL';
        } else if(error.message.includes(AuthErrorCodes.USER_DISABLED)) {
          this.errorMessage = 'USER_DISABLED';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }

  onSignupRedirect() {
    this.router.navigate(['auth/signup']);
  }

  gotoDashboard() {
    this.router.navigate(['/home']);
  }

  onSignInWithGoogle() {
    signInWithPopup(this.auth, this.googleAuthProvider).then((result) => {
      this.sharedService.setUser(result.user);
      this.gotoDashboard();
    }).catch((error) => {
      this.showError = true;
      if (error instanceof Error) {
        if (error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
          this.errorMessage = 'INVALID_EMAIL';
        } else if (error.message.includes(AuthErrorCodes.USER_DISABLED)) {
          this.errorMessage = 'USER_DISABLED';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    });
  }


}
