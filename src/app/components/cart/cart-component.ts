import { Component, EventEmitter} from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { Router } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'cart',
  imports: [],
  templateUrl: './cart-component.html'
})
export class CartComponent{
  
  items: CartItem[] = [];
  total: number = 0;
  

  constructor(
    private readonly router: Router,
    private readonly sharingDataService: SharingDataService
  ){
    this.items = router.getCurrentNavigation()?.extras.state!['items'];
    this.total = router.getCurrentNavigation()?.extras.state!['total'];
  }

  onDeleteCart(id: number){
    this.sharingDataService.idProductEventEmitter.emit(id);
  }

}
