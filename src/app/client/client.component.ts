import { Component, OnInit } from '@angular/core';
import { BinddingService } from '../services/bindding.service';

@Component({
  selector: 'app-client',
  imports: [],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit{
  constructor(private bindding: BinddingService){}

  ngOnInit(): void {
    this.sendDataToParent()
  }

  sendDataToParent() {
    this.bindding.sendData({isSelected:1, index:2});
  }
}
