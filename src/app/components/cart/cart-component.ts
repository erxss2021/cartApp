import { Component, EventEmitter, OnInit} from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { Router } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { itemsState } from '../../store/items.reducer';
import { total } from '../../store/items.actions';

@Component({
  selector: 'cart',
  imports: [],
  templateUrl: './cart-component.html'
})
export class CartComponent{
  
  items: CartItem[] = [];

  total: number = 0;
  

  constructor(
    private readonly store: Store<{items: itemsState}>,
    private readonly sharingDataService: SharingDataService
  ){
    this.store.select('items').subscribe(state =>{
      this.items = state.items;
      this.total = state.total;
    })
  }

  onDeleteCart(id: number){
    this.sharingDataService.idProductEventEmitter.emit(id);
  }

}
