import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  constructor(private bindding: BinddingService, private productService: ProductService){}

  products:any=[]

  async ngOnInit() {
    this.sendDataToParent()
    let response = await this.productService.getProducts();
    if(response!=null){
      this.products = response.data;
    }
  }

  sendDataToParent() {
    this.bindding.sendData({isSelected:1, index:1});
  }
}
