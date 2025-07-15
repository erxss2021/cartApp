import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar-component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { itemsState } from '../store/items.reducer';
import { add, remove, total } from '../store/items.actions';

@Component({
  selector: 'cart-app',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './cart-app-component.html'
})
export class CartAppComponent implements OnInit{

  items: CartItem[] = [];

  constructor(
    private readonly store: Store<{items: itemsState}>,
    private readonly sharingDataService: SharingDataService,
    private readonly router: Router
  ){
    this.store.select('items').subscribe(state => {
      this.items = state.items;

      this.saveSession();
      console.log('Cambio el estado...');
    });
  }

  ngOnInit(): void {
    this.onDeleteCart();
    this.store.dispatch(total());
    this.onAddCart();
  }

  onAddCart(): void{
    this.sharingDataService.productEventEmitter.subscribe( product => {

      this.store.dispatch(add({product}));
      this.store.dispatch(total());
     
      this.router.navigate(['/cart']);

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
          this.store.dispatch(remove({id}));
          this.store.dispatch(total());

          this.router.navigate(['/cart']);
          
          Swal.fire({
            title: "Deleted!",
            text: "Your item has been deleted at Cart.",
            icon: "success"
          });
        }
      });

    });
  }

  saveSession():void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
