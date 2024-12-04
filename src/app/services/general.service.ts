import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BinddingService } from "./bindding.service";

@Injectable({providedIn:'root'})
export class GeneralService {

    constructor(private router:Router, private bindding: BinddingService){}

    apiURL:string="http://localhost:8080";
    errorMessage="";

    headers = {
        'Content-Type':'application/json',
    }

    private sendDataToParent() {
        this.bindding.sendData({isSelected:1, index:0});
    }

    handleError(error: any, option:number) {
        let flag = true
        if(error.error instanceof ErrorEvent){
            this.errorMessage = error.error.message;
        }else{
            console.log(error)
            let statusCode = error.status
            let message = ""
            switch(statusCode){
              case 401:
                if(option==0){
                    message = "Tu sesión ha expirado"
                    flag = false;
                }else{
                    message = "Usuario y/o contraseña incorrectos"
                }
                break
              case 409:
                message = error.response.data
                break
              default:
                message=error.message
            }
            this.errorMessage = `Error code: ${statusCode}\n Message: ${message}`
        }

        window.alert(this.errorMessage);
        if (!flag) {
            localStorage.removeItem('authToken')
            this.sendDataToParent()
            this.router.navigate(["/login"])
        }
    }
    
}