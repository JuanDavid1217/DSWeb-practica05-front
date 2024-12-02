import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ClientComponent } from './client/client.component';
import { SaleComponent } from './sale/sale.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path:'', redirectTo: '/sales', pathMatch: 'full'},
    {path:'sales', component: SaleComponent, canActivate: [AuthService]},
    {path:'products', component: ProductComponent, canActivate: [AuthService]},
    {path:'clients', component: ClientComponent, canActivate: [AuthService]},
    {path:'login', component: LoginComponent},
    {path:'**', redirectTo: '/sales'}
];
