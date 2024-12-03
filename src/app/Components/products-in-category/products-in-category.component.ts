import { Component, OnInit , inject ,signal} from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute ,Router} from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';


export interface Product {
  productId: number;
  name: string;
  productCode: string;
  image: string;
  pdfLink:string;
  categoryId: number;
  brandId: number;
  brandName:string;
  categoryName:string;
}

export interface Category {
  categoryID: number;
  categoryName: string;
  image: string;
}

export interface Brand {
  brandID: number;
  brandName: string;
  image: string;
}


@Component({
  selector: 'app-products-in-category',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './products-in-category.component.html',
  styleUrl: './products-in-category.component.css'
})
export class ProductsInCategoryComponent {
  currentPage = 1;
  pageSize = 9;
  totalProducts = 0;
  totalPages = 0;
  brandid = 0;
  categoryID = 0;
  brandName= ""
  categoryName= ""
  pdfLink: string | null = null;


  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute)
  router = inject(Router)

  public Products = signal<Product[]>([]);

  getAllProducts(): void {
    const apiUrl = `http://localhost:5210/api/Product/${this.categoryID}/${this.currentPage}/${this.pageSize}`;
    this.httpClient.get<{ count: number, products: Product[] }>(apiUrl).subscribe({
      next: (response) => {
        const productWithDetails$ = response.products.map((product) => {
          return this.getBrandDetails(product.brandId).pipe(
            switchMap((brand: Brand) => {
              return this.getCategoryDetails(product.categoryId).pipe(
                map((category: Category) => {
                  return {
                    ...product,
                    brandName: brand.brandName,
                    categoryName: category.categoryName
                  };
                })
              );
            })
          );
        });
  
        forkJoin(productWithDetails$).subscribe({
          next: (productsWithDetails: Product[]) => {
            this.Products.set(productsWithDetails);  
            this.totalProducts = response.count;
            this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
            window.scrollTo(0,0)
          },
          error: (err) => {
            console.error('Error fetching products:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
  
  getBrandDetails(brandId: number) {
    const apiUrl = `http://localhost:5210/api/Brand/${brandId}`;
    return this.httpClient.get<Brand>(apiUrl);
  }

  getCategoryDetails(categoryId: number) {
    const apiUrl = `http://localhost:5210/api/Category/${categoryId}`;
    return this.httpClient.get<Category>(apiUrl);
  }


  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.categoryID = +params['categoryID']
      this.categoryName = params['categoryName']
      this.getAllProducts();
    })
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllProducts();
    }
  }

 
}
