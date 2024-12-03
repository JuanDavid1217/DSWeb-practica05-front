import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private service:GeneralService){};

  completeHeader(){
    let headers:any = this.service.headers;
    headers['Authorization']=`Bearer ${localStorage.getItem('authToken')}`;
    return headers;
  }
  
  async getClients(){
    let headers = this.completeHeader();
    try{
      return await axios.get<any>(this.service.apiURL+`/clients`, headers={headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

  async updateClient(id:number, body:any){
    let headers = this.completeHeader();
    try{
      return await axios.put<any>(this.service.apiURL+`/clients/${id}`, body, headers={headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

  async deleteClient(id:number){
    let headers = this.completeHeader();
    try{
      return await axios.delete<any>(this.service.apiURL+`/clients/${id}`, headers={headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

  async createClient(body:any){
    let headers = this.completeHeader();
    try{
      return await axios.post<any>(this.service.apiURL+`/clients`, body, headers={headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null;
    }
  }

  async getAllSalesByClient(id:number){
    let headers = this.completeHeader();
    try{
      return await axios.get<any>(this.service.apiURL+`/sales/byClient/${id}`, headers={headers});
    }catch(Error){
      this.service.handleError(Error, 0)
      return null
    }
  }
}
