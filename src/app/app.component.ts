import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BinddingService } from './services/bindding.service';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{
  
  constructor(private changeDetectorRef: ChangeDetectorRef, private router:Router, private activatedRoute:ActivatedRoute, private bindding: BinddingService){}

  title = 'DSWeb-practica05-front';
  options=[
    {
      isSelected:0,
      path:"/sales",
      name:"Ventas"
    },
    {
      isSelected:0,
      path:"/products",
      name:"Productos"
    },
    {
      isSelected:0,
      path:"/clients",
      name:"Clientes"
    },
    {
      isSelected:0,
      path:"/login",
      name:"Salir"
    }
  ]

  subscription: any;
  receivedData: any;

  ngOnInit(){
    this.subscription = this.bindding.data$.subscribe(data => {
      for (let i=0; i<this.options.length; i++){
        this.options[i].isSelected=0;
      }
      this.receivedData = data;
      if(data.index!=null  && this.options.length>0){
        this.options[data.index].isSelected=1;
      }else{
        this.options[0].isSelected=1;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  navigate(index:any){
    if (this.options[index].name=="Salir"){
      localStorage.removeItem('authToken')
    }
    this.router.navigate([this.options[index].path]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
