import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../services/client.service';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit{
  constructor(private bindding: BinddingService, private clientService:ClientService, private saleService:SaleService){}

  clientsAll:any = [];
  clients:any = [];
  mask="";
  isActivateNewWindow = false;
  selectedClient:any = null;
  isPersonalDataVisible = false;
  isActivateDeleteWindow = false;
  isActivateSaleWindow = false;
  salesAll:any = [];
  sales:any = [];
  selectedSale:any;
  startDate:any = ""
  endDate:any = ""

  async ngOnInit() {
    this.sendDataToParent()
    let response = await this.clientService.getClients();
    if (response!=null){
      this.clientsAll = JSON.parse(JSON.stringify(response.data));
      this.clientsAll = this.clientsAll.sort((clientA:any, clientB:any)=>clientA.id-clientB.id)
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

  closeWindow(option:number){
    if (option==1) {
      this.selectedClient = null
    }
    this.isActivateNewWindow = false
    this.isActivateDeleteWindow = false
  }

  clickCard(event:MouseEvent){
    event.stopPropagation()
  }

  showNewWindow(){
    this.selectedClient = {name:"", lastName:"", maternalSurname:"", address:"", phone:"", email:""}
    this.isActivateNewWindow = true
  }

  showDeleteWindow(){
    this.isActivateDeleteWindow = true;
  }

  async create(option:number){
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
    if (option==1) {
      let response = await this.clientService.createClient(this.selectedClient)
      if(response!=null){
        let client = JSON.parse(JSON.stringify(response.data))
        this.clients.push(client)
        this.clientsAll.push(client)
        this.closeWindow(1)
      }
    }else{
      let response = await this.clientService.updateClient(this.selectedClient.id, this.selectedClient)
      if(response!=null){
        this.selectedClient = JSON.parse(JSON.stringify(response.data))
        let index = this.clientsAll.findIndex((client:any)=>client.id==this.selectedClient.id)
        this.clientsAll[index] = JSON.parse(JSON.stringify(this.selectedClient))
        index = this.clients.findIndex((client:any)=>client.id == this.selectedClient.id)
        this.clients[index] = JSON.parse(JSON.stringify(this.selectedClient))
        window.alert("Cliente actualizado exitosamente.")
      }
    }
  }

  delete(){
    let response = this.clientService.deleteClient(this.selectedClient.id);
    if (response != null){
      let index = this.clientsAll.findIndex((client:any)=>client.id==this.selectedClient.id)
      this.clientsAll.splice(index, 1)
      index = this.clients.findIndex((client:any)=>client.id == this.selectedClient.id)
      this.clients.splice(index, 1)
      this.closeWindow(2)
      this.close()
    } 
  }

  async viewPersonalData(client:any){
    this.selectedClient = JSON.parse(JSON.stringify(client))
    this.isPersonalDataVisible = true;
    let response = await this.clientService.getAllSalesByClient(client.id)
    if (response!=null){
      this.salesAll = JSON.parse(JSON.stringify(response.data))
      this.sales = JSON.parse(JSON.stringify(this.salesAll))
    }
  }

  close(){
    this.selectedClient = null;
    this.isPersonalDataVisible = false;
    this.startDate = "";
    this.endDate = "";
  }

  filterSales(){
    if (this.startDate!="" && this.endDate!=""){
      if (this.endDate<this.startDate){
        let temp = this.endDate
        this.endDate = this.startDate
        this.startDate = temp
      }
      this.sales = JSON.parse(
                      JSON.stringify(
                        this.salesAll.filter(
                          (sale:any) => (
                            new Date(
                              Number(sale.date.split('/')[2]),
                              Number(sale.date.split('/')[1])-1,
                              Number(sale.date.split('/')[0])
                            )
                            >=
                            new Date(
                              Number(this.startDate.split('-')[0]),
                              Number(this.startDate.split('-')[1])-1,
                              Number(this.startDate.split('-')[2])
                            )
                            &&
                            new Date(
                              Number(sale.date.split('/')[2]),
                              Number(sale.date.split('/')[1])-1,
                              Number(sale.date.split('/')[0])
                            )
                            <=
                            new Date(
                              Number(this.endDate.split('-')[0]),
                              Number(this.endDate.split('-')[1])-1,
                              Number(this.endDate.split('-')[2])
                            )
                          )
                        )
                      )
                    )
    }else{
      this.sales = JSON.parse(JSON.stringify(this.salesAll))
    }
  }

  async download(id:number){
    let response = await this.saleService.download(id)
    if(response!=null){
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `venta_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    }
  }

  async sendByEmail(id:number){
    let response = await this.saleService.sendByEmail(id)
    if(response!=null){
      window.alert("Archivo enviado exitosamente.")
    }
  }

  viewDetails(sale:any){
    this.selectedSale = JSON.parse(JSON.stringify(sale))
    console.log(this.selectedSale);
    this.isActivateSaleWindow = true;
  }

  back(){
    this.isActivateSaleWindow=false;
    this.selectedSale=null;
  }
}
