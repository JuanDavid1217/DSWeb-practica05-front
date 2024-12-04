import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private service:GeneralService){};

  completeHeader(){
    let headers:any = this.service.headers;
    headers['Authorization']=`Bearer ${localStorage.getItem('authToken')}`;
    return headers;
  }
  
  async download(id:number){
    let headers = this.completeHeader();
    try{
      return await axios.get<any>(this.service.apiURL+`/sales/download/${id}`, {headers, responseType: "blob"});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

  async sendByEmail(id:number){
    let headers = this.completeHeader();
    try{
      return await axios.get<any>(this.service.apiURL+`/sales/sendSale/${id}`, headers={headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

  async saveSale(sale:any){
    let headers = this.completeHeader();
    try{
      return await axios.post<any>(this.service.apiURL+`/sales`, sale, headers={headers})
    }catch(Error){
      this.service.handleError(Error, 0)
      return null
    }
  }
}
