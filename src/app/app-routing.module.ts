import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {DetailComponent} from "./detail/detail.component";
import {LoginComponent} from "./login/login.component";
import {CartComponent} from "./cart/cart.component";


const routes: Routes = [
  {
    path: 'home-page' , component: HomePageComponent
  },
  {
    path: 'detail' , component: DetailComponent
  },{
    path: 'login' , component: LoginComponent
  },{
    path: 'cart' , component: CartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
