import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit{
  constructor(private bindding: BinddingService, private clientService:ClientService){}

  clientsAll:any = [];
  clients:any = [];
  mask="";
  isActivateNewWindow = false;
  selectedClient:any = null;

  async ngOnInit() {
    this.sendDataToParent()
    let response = await this.clientService.getClients();
    if (response!=null){
      this.clientsAll = JSON.parse(JSON.stringify(response.data));
      this.clientsAll = this.clientsAll.sort((clientA:any, clientB:any)=>clientA-clientB)
      this.clients = JSON.parse(JSON.stringify(this.clientsAll));
    }
  }

  sendDataToParent() {
    this.bindding.sendData({isSelected:1, index:2});
  }

  filter(){
    if(this.mask.trim()!=""){
      this.clients = JSON.parse(JSON.stringify(this.clientsAll.filter((client:any)=>
        (client.name.toLowerCase()+" "
        +client.lastName.toLowerCase()+" "
        +(client.maternalSurname!=null?client.maternalSurname.toLowerCase():""))
        .includes(this.mask.trim().toLowerCase()))))
    }else{
      this.clients = JSON.parse(JSON.stringify(this.clientsAll))
    }
  }

  closeWindow(){
    this.selectedClient = null
    this.isActivateNewWindow=false
  }

  clickCard(event:MouseEvent){
    event.stopPropagation()
  }

  showNewWindow(){
    this.selectedClient = {name:"", lastName:"", maternalSurname:"", address:"", phone:"", email:""}
    this.isActivateNewWindow = true
  }

  async create(){
    if(this.selectedClient.name.trim()==""||this.selectedClient.lastName.trim()==""
      ||this.selectedClient.maternalSurname.trim()==""||this.selectedClient.address.trim()==""
      ||this.selectedClient.phone.trim()==""||this.selectedClient.email.trim()==""){
        window.alert("Por favor, ingresa todos los campos.")
        return
    }
    this.selectedClient.name = this.selectedClient.name.trim()
    this.selectedClient.lastName = this.selectedClient.lastName.trim()
    this.selectedClient.maternalSurname = this.selectedClient.maternalSurname.trim()
    this.selectedClient.address = this.selectedClient.address.trim()
    this.selectedClient.phone = this.selectedClient.phone.trim()
    this.selectedClient.email = this.selectedClient.email.trim()
    let response = await this.clientService.createClient(this.selectedClient)
    if(response!=null){
      let client = JSON.parse(JSON.stringify(response.data))
      this.clients.push(client)
      this.clientsAll.push(client)
      this.closeWindow()
    }
  }
}
