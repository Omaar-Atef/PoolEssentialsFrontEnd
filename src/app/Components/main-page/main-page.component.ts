import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CategoryHomeComponent } from '../category-home/category-home.component';
import { ProductsHomeComponent } from '../products-home/products-home.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [HeaderComponent,CategoryHomeComponent,ProductsHomeComponent,AboutComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
