import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
loginForm!:FormGroup;

constructor(private fb:FormBuilder,
private router:Router){

}
ngOnInit(): void {
  this.loginForm = this.fb.group({
    username:['',Validators.required],
    password:['',Validators.required]
  });
}

onSubmit(){
  if(this.loginForm.valid){
    const{username,password}=this.loginForm.value;
    if(username === 'admin'&& password ==='admin123'){
      this.router.navigate(['/admin']);
    }else if(username === 'user' &&
      password === 'user123'){
        this.router.navigate(['/user']);
      }else{
          alert('Inavlid Crendtials')
      }
    
    }
  }
}


