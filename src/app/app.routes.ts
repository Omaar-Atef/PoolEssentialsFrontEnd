import { Routes } from '@angular/router';
import { BrandsListComponent } from './Components/brands-list/brands-list.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { CategoriesListComponent } from './Components/categories-list/categories-list.component';
import { AboutComponent } from './Components/about/about.component';
import { BrandCategoriesComponent } from './Components/brand-categories/brand-categories.component';
import { BrandCategoryProductComponent } from './Components/brand-category-product/brand-category-product.component';
import { ProductsListComponent } from './Components/products-list/products-list.component';
import { ProductsInCategoryComponent } from './Components/products-in-category/products-in-category.component';
import { AdminPageComponent } from './Components/admin-page/admin-page.component';

export const routes: Routes = [{ path: "", component: MainPageComponent },
{ path: "brands", component:BrandsListComponent},
{ path: 'categories', component:CategoriesListComponent},
{ path: 'about', component:AboutComponent},
{ path: 'categories/for-brand/:brandID/:brandName', component:BrandCategoriesComponent},
{ path: 'categories/for-brand/for-category/:brandID/:brandName/:categoryID/:categoryName', component:BrandCategoryProductComponent},
{ path: 'products', component:ProductsListComponent},
// { path: 'categories/PrdInCat/:brandID/:brandName/:categoryID/:categoryName', component:ProductsInCategoryComponent}
{ path: 'categories/PrdInCat/:categoryID/:categoryName', component:ProductsInCategoryComponent},
{ path: 'adminPage', component:AdminPageComponent}
];
