import { Component } from '@angular/core';
import { RouterModule ,Router ,RouterOutlet ,RouterLink } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { HeaderComponent } from './Components/header/header.component';
import { CategoryHomeComponent } from './Components/category-home/category-home.component';
import { ProductsHomeComponent } from './Components/products-home/products-home.component';
import { AboutComponent } from './Components/about/about.component';
import { BrandsListComponent } from './Components/brands-list/brands-list.component';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CategoriesListComponent } from './Components/categories-list/categories-list.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrandCategoriesComponent } from './Components/brand-categories/brand-categories.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink,RouterModule,RouterOutlet,
    BrandCategoriesComponent,MainPageComponent,CategoriesListComponent,BrandsListComponent,FooterComponent,NavBarComponent,HeaderComponent,CategoryHomeComponent,ProductsHomeComponent,AboutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PoolsFrontEnd';
}
