import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private service:GeneralService){};

  completeHeader(){
    let headers:any = this.service.headers;
    headers['Authorization']=`Bearer ${localStorage.getItem('authToken')}`;
    return headers;
  }
  
  async getProducts(){
    let headers = this.completeHeader();
    try{
      return await axios.get<any>(this.service.apiURL+"/products", {headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

}
