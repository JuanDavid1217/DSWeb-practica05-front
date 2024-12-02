import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';

@Component({
  selector: 'app-sale',
  imports: [],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent  implements OnInit{
  constructor(private bindding: BinddingService){}

  ngOnInit(): void {
    this.sendDataToParent()
  }

  sendDataToParent() {
    this.bindding.sendData({isSelected:1, index:0});
  }
}
