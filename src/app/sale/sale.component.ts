import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';
import { ClientService } from '../services/client.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'app-sale',
  imports: [CommonModule, FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent  implements OnInit{
  constructor(private bindding: BinddingService,
              private clientService: ClientService,
              private productService:ProductService,
              private saleService: SaleService
            ){}

  clientsAll:any = []
  clients:any = []
  selectedClientName:any = ""
  isVisibleFilter=false
  selectedClient:any
  saleProducts:any=[]
  selectedSaleProducts:any=[]
  count=0
  total=0


  windowProducts = false
  products:any = []
  allProducts:any = []
  selectedProducts:any = []
  mask=""

  cleanProducts(){
    this.windowProducts = false
    this.products = []
    this.allProducts = []
    this.selectedProducts = []
    this.mask=""
  }
  

  async ngOnInit() {
    this.sendDataToParent()
    let response = await this.clientService.getClients();
    if (response!=null){
      this.clientsAll = JSON.parse(JSON.stringify(response.data))
      this.clientsAll = this.clientsAll.sort((clientA:any, clientB:any)=>clientA.id-clientB.id)
      this.clients = JSON.parse(JSON.stringify(this.clientsAll))
    }
  }

  sendDataToParent() {
    this.bindding.sendData({isSelected:1, index:0});
  }

  filter(){
    if(this.selectedClientName.trim()!=""){
      this.isVisibleFilter = true
      this.clients = JSON.parse(JSON.stringify(this.clientsAll.filter((client:any)=>
        (client.name.toLowerCase()+" "
        +client.lastName.toLowerCase()+" "
        +(client.maternalSurname!=null?client.maternalSurname.toLowerCase():""))
        .includes(this.selectedClientName.trim().toLowerCase()))))
    }else{
      this.clients = JSON.parse(JSON.stringify(this.clientsAll))
      this.selectedClient=null
      this.isVisibleFilter=false
    }
  }

  selectClient(client:any){
    this.selectedClient = JSON.parse(JSON.stringify(client))
    this.selectedClientName = `${this.selectedClient.name} ${this.selectedClient.lastName} ${this.selectedClient.maternalSurname!=null?this.selectedClient.maternalSurname:''}`
    this.isVisibleFilter = false
  }

  closeWindow(){
    this.cleanProducts()
  }

  async showWindow(){
    let response = await this.productService.getProducts();
    if(response!=null){
      this.allProducts = JSON.parse(JSON.stringify(response.data))
      this.allProducts = this.allProducts.sort((productA:any, productB:any)=>productA.id-productB.id)
      for(let i=0; i<this.allProducts.length; i++){
        this.allProducts[i]["selected"]=false
      }
      this.products = JSON.parse(JSON.stringify(this.allProducts))
      this.windowProducts = true
    }
  }

  filterProduct(){
    if(this.mask.trim()!=""){
      this.products = JSON.parse(JSON.stringify(this.allProducts.filter((product:any)=>
        product.name.toLowerCase().includes(this.mask.trim().toLowerCase())
      )))
    }else{
      this.products = JSON.parse(JSON.stringify(this.allProducts))
    }
    this.fillOut()
  }

  fillOut(){
    for(let i=0; i<this.selectedProducts.length; i++){
      let index = this.products.findIndex((product:any)=>product.id==this.selectedProducts[i].id)
      if (index!=-1){
        this.products[index].selected=true
      }
    }
  }

  select(id:number){
    let index = this.products.findIndex((product:any)=>product.id==id)
    if (this.products[index].selected){
      this.products[index].selected=false
      index = this.selectedProducts.findIndex((product:any)=>product.id==id)
      this.selectedProducts.splice(index, 1)
    }else{
      this.products[index].selected=true
      this.selectedProducts.push(JSON.parse(JSON.stringify(this.products[index])))
    }
  }

  load(){
    for (let i=0; i<this.selectedProducts.length; i++){
      this.selectedProducts[i].selected=false
      let index = this.saleProducts.findIndex((product:any)=>product.id==this.selectedProducts[i].id)
      if (index != -1){
        this.saleProducts[index].quantity += 1;
      }else{
        this.selectedProducts[i]["quantity"]=1
        this.saleProducts.push(JSON.parse(JSON.stringify(this.selectedProducts[i])))
      }
    }
    this.calculate()
    this.closeWindow()
  }

  calculate(){
    this.count = 0
    this.total = 0
    for(let i=0; i<this.saleProducts.length; i++){
      this.count += this.saleProducts[i].quantity
      this.total += (this.saleProducts[i].quantity*this.saleProducts[i].price)
    }
  }

  clickCard(event:MouseEvent){
    event.stopPropagation()
  }

  remove(index:number){
    this.saleProducts.splice(index,1);
    this.calculate();
  }

  removeList(){
    for(let i=0; i<this.selectedSaleProducts.length; i++){
      let index = this.saleProducts.findIndex((product:any)=>product.id==this.selectedSaleProducts[i].id)
      this.saleProducts.splice(index,1)
    }
    this.selectedSaleProducts=[]
    this.calculate();
  }

  clean(){
    this.selectedClientName = ""
    this.isVisibleFilter=false
    this.selectedClient=null
    this.saleProducts = []
    this.selectedSaleProducts = []
    this.count=0
    this.total=0
  }

  select2(id:number){
    try{
      let index = this.saleProducts.findIndex((product:any)=>product.id==id)
      if (this.saleProducts[index].selected){
        this.saleProducts[index].selected=false
        index = this.selectedSaleProducts.findIndex((product:any)=>product.id==id)
        this.selectedSaleProducts.splice(index, 1)
      }else{
        this.saleProducts[index].selected=true
        this.selectedSaleProducts.push(JSON.parse(JSON.stringify(this.saleProducts[index])))
      }
    }catch(error){

    }
  }

  async saveSale(){
    let details:any = []
    for(let i=0; i<this.saleProducts.length; i++){
      details.push(
        {
          productId: this.saleProducts[i].id,
          quantity: this.saleProducts[i].quantity
        }
      )
    }
    let date = new Date();
    let body={
      client_id: this.selectedClient.id,
      date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
      details: details,
      total: this.total
    }
    let response = await this.saleService.saveSale(body);
    if (response != null){
      window.alert('Venta registrada con exito.')
      this.clean()
    }
  }
}
