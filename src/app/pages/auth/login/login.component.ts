import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseForm } from 'src/app/shared/utils/base-form';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm= this.fb.group({
    username: ["", Validators.required],
    password: ["", [Validators.required, Validators.minLength(2)]]
  })

  constructor(private fb:FormBuilder,
    public baseForm: BaseForm,
    private authSvc:AuthService){
  }

  ngOnInit(): void{

  }

  onLogin(){
    if(this.loginForm.invalid) return;

    const data= this.loginForm.value;

    this.authSvc.login(data).subscribe((result)=>{

    })

  }



}
