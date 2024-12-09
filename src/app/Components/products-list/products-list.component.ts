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
  categoryId: number;
  pdfLink:string|null;
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
  selector: 'app-products-list',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent {
  currentPage = 1;
  pageSize = 9;
  totalProducts = 0;
  totalPages = 0;
  brandid = 0;
  categoryID = 0;
  brandName= ""
  categoryName= "";
  pdfLink: string | null = null;
  searchQuery: string = '';
  productCodeQuery: string = '';


  httpClient = inject(HttpClient);
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  public Products = signal<Product[]>([]);

  getAllProducts(): void {
    const apiUrl = `http://localhost:5210/api/Product/${this.currentPage}/${this.pageSize}`;
    this.httpClient.get<{ count: number, products: Product[] }>(apiUrl).subscribe({
      next: (response) => {

        if (!response || !response.products) {
          console.error('Products are not available in the response');
          return;
        }

        // Proceed with mapping the products if valid
        const productsWithDetails$ = response.products.map((product) => {
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


        forkJoin(productsWithDetails$).subscribe({
          next: (productsWithDetails: Product[]) => {
            this.Products.set(productsWithDetails);
            this.totalProducts = response.count;  
            this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
            window.scrollTo(0, 0);
          },
          error: (err) => {
            console.error('Error fetching products with details:', err);
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
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.productCodeQuery = params['productCode'] || '';
      if (this.searchQuery) {
        this.searchProducts(this.searchQuery)
      }
      else if(this.productCodeQuery)
      {
        this.searchProductCodes(this.productCodeQuery)
      }
      else {
        this.getAllProducts();
      }
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
    
  searchProductCodes(query: string): void {
    const apiUrl = `http://localhost:5210/api/Product/${query}`;
    this.httpClient.get<Product[]>(apiUrl).subscribe({
      next: (response) => {
        if (!response || !response.length) {
          // No products found, reset products and pagination
          this.Products.set([]);
          this.totalProducts = 0;
          this.totalPages = 0;
          console.error('No products found for the given query');
          return;
        }
  
        // Proceed with mapping the products if valid
        const productsWithDetails$ = response.map((product) => {
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
  
        forkJoin(productsWithDetails$).subscribe({
          next: (productsWithDetails: Product[]) => {
            this.Products.set(productsWithDetails);
            this.totalProducts = productsWithDetails.length; // Total is the length of the filtered results
            this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          },
          error: (err) => {
            // If error occurs during the forkJoin mapping, handle it gracefully
            console.error('Error fetching products with details:', err);
            this.Products.set([]);
            this.totalProducts = 0;
            this.totalPages = 0;
          }
        });
      },
      error: (err) => {
        // If error occurs during the HTTP request, handle it gracefully
        console.error('Error fetching products:', err);
        this.Products.set([]);
        this.totalProducts = 0;
        this.totalPages = 0;
      }
    });
  }
  

  searchProducts(query: string): void {
    const apiUrl = `http://localhost:5210/api/Product/${query}/GetByName`;
    this.httpClient.get<Product[]>(apiUrl).subscribe({
      next: (response) => {
        if (!response || !response.length) {
          // No products found, reset products and pagination
          this.Products.set([]);
          this.totalProducts = 0;
          this.totalPages = 0;
          console.error('No products found for the given query');
          return;
        }
  
        // Proceed with mapping the products if valid
        const productsWithDetails$ = response.map((product) => {
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
  
        forkJoin(productsWithDetails$).subscribe({
          next: (productsWithDetails: Product[]) => {
            this.Products.set(productsWithDetails);
            this.totalProducts = productsWithDetails.length; // Total is the length of the filtered results
            this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          },
          error: (err) => {
            console.error('Error fetching products with details:', err);
          }
        });
      },
      error: (err) => {
        // In case of error, reset products and pagination
        this.Products.set([]);
        this.totalProducts = 0;
        this.totalPages = 0;
        console.error('Error fetching products:', err);
      }
    });
  }
  

 

}
