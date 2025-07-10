import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar-component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'cart-app',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './cart-app-component.html'
})
export class CartAppComponent implements OnInit{

  items: CartItem[] = [];
  total:number = 0;

  constructor(
    private readonly sharingDataService: SharingDataService,
    private readonly service: ProductService,
    private readonly router: Router
  ){}

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart') || '[]') ;
    this.calculateTotal();
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void{
    this.sharingDataService.productEventEmitter.subscribe( product => {
      const hasItem = this.items.find(item => {
        return item.product.id === product.id;
      });
      if(hasItem){
        this.items = this.items.map(item => {
          if(item.product.id === product.id){
            return {...item, quantity: item.quantity + 1}
          }
          return item;
        })
      }else{
  
        this.items = [... this.items, {product: {... product}, quantity: 1}];
      }
      this.calculateTotal();
      this.saveSession();
      this.router.navigate(['/cart'], {state: {items: this.items,total: this.total}});

      Swal.fire({
        title: "shopping Cart",
        text: "Add new Product at Cart!",
        icon: "success"
      });
    });
  }

  onDeleteCart(): void{
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Are you sure?",
        text: "alert it item delete at Cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.items = this.items.filter(item => item.product.id !== id);
          if(this.items.length == 0){
            sessionStorage.removeItem('cart');
            sessionStorage.clear();
          }
          this.calculateTotal();
          this.saveSession();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => { 
            this.router.navigate(['/cart'], {state: {items: this.items,total: this.total}});
          });
          
          Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted at Cart.",
            icon: "success"
          });
        }
      });

    });
  }

  calculateTotal(): void{
    this.total = this.items.reduce( (accumulator, item) =>  accumulator + item.quantity  * item.product.price, 0);
  }

  saveSession():void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
