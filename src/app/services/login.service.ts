import { Injectable } from "@angular/core";
import { GeneralService } from "./general.service";
import axios from 'axios';

@Injectable({providedIn:'root'})
export class LoginService{
    constructor(private service:GeneralService){};

    async login(user:string, password:string){
        try{
          return await axios.post<any>(this.service.apiURL+"/users/login",
          {userName:user, password:password});
        }catch(Error){
          this.service.handleError(Error, 1)
          return null
        }
    }
}