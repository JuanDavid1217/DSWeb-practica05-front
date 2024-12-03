import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product',
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  constructor(private bindding: BinddingService, private productService: ProductService){}

  productsAll:any = []
  products:any=[]
  mask = ""
  selectedProduct:any = null;

  isActivateUpdateWindow = false;
  isActivateDeleteWindow = false;

  async ngOnInit() {
    this.sendDataToParent()
    let response = await this.productService.getProducts();
    if(response!=null){
      this.productsAll = JSON.parse(JSON.stringify(response.data));
      this.productsAll = this.productsAll.sort((productA:any, productB:any)=> productA.id - productB.id)
      this.products = JSON.parse(JSON.stringify(this.productsAll));
    }
  }

  sendDataToParent() {
    this.bindding.sendData({isSelected:1, index:1});
  }

  filter(){
    if(this.mask.trim()!=""){
      this.products = JSON.parse(JSON.stringify(this.productsAll.filter( (product:any) => product.name.toLowerCase().includes(this.mask.trim().toLowerCase()))));
    }else{
      this.products = JSON.parse(JSON.stringify(this.productsAll));
    }
  }

  showUpdateWindow(product:any){
    if(product==1){
      this.selectedProduct={name: '', description: '', price: 0, stock: 0, id: null}
    }else{
      this.selectedProduct = JSON.parse(JSON.stringify(product));
    }
    this.isActivateUpdateWindow = true;
  }

  showDeleteWindow(product:any){
    this.selectedProduct = JSON.parse(JSON.stringify(product));
    this.isActivateDeleteWindow = true;
  }

  closeWindows(){
    this.selectedProduct = null;
    this.isActivateUpdateWindow = false;
    this.isActivateDeleteWindow = false;
  }

  clickCard(event:MouseEvent){
    event.stopPropagation();
  }

  async update(){
    if(this.selectedProduct.name.trim()==""||this.selectedProduct.description.trim()==""){
        window.alert("Por favor, ingresa todos los campos.")
        return
    }
    let price = Number(this.selectedProduct.price)
    let stock = Number(this.selectedProduct.stock)
    if (Number.isNaN(price)||Number.isNaN(stock)||price<=0||stock<0){
      window.alert("Los valores para 'Precio Venta' y 'Cantidad Disponible' deben ser numéricos.\nNota: El precio debe ser mayor que cero")
      return
    }
    this.selectedProduct.price=price;
    this.selectedProduct.stock=stock;
    let body = {
      name: this.selectedProduct.name,
      description: this.selectedProduct.description,
      price: this.selectedProduct.price,
      stock: this.selectedProduct.stock,
    }
    if(this.selectedProduct.id!=null){
      let response = await this.productService.updateProduct(this.selectedProduct.id, body)
      if (response != null){
        this.selectedProduct = response.data
        let index = this.products.findIndex((product:any)=>product.id==this.selectedProduct.id)
        this.products[index] = JSON.parse(JSON.stringify(this.selectedProduct))
        index = this.productsAll.findIndex((product:any)=>product.id==this.selectedProduct.id)
        this.productsAll[index] = JSON.parse(JSON.stringify(this.selectedProduct));
        this.closeWindows();
      }
    }else{
      let response = await this.productService.createProduct(body)
      if (response != null){
        this.productsAll.push(response.data)
        this.products = JSON.parse(JSON.stringify(this.productsAll))
        this.closeWindows();
      }
    }
  }

  async delete(){
    let response = await this.productService.deleteProduct(this.selectedProduct.id);
    if (response!=null){
      let index = this.products.findIndex((product:any)=>product.id==this.selectedProduct.id);
      this.products.splice(index,1);
      index = this.productsAll.findIndex((product:any)=>product.id==this.selectedProduct.id)
      this.productsAll.splice(index,1);
      this.closeWindows();
    }
  }
}
