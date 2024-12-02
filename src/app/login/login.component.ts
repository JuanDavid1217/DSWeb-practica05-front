import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private loginService: LoginService, private router:Router){}

  user:string = "";
  password:string = "";

  async login(){
    if(this.user.trim()=="" && this.password.trim()==""){
      window.alert("Ingresa los campos solicitados.")
      return
    }
    let response = await this.loginService.login(this.user, this.password);
    if (response != null){
      localStorage.setItem('authToken', response.data.token)
      this.router.navigate(["/sales"]);
    }
  }
}
