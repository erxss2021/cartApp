import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartAppComponent } from "./components/cart-app-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartAppComponent],
  templateUrl: './app.html'
})
export class App {
  protected title = 'cart-app';
}
