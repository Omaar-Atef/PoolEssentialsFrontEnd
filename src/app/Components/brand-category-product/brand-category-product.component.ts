import { Component, OnInit , inject ,signal} from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute ,Router} from '@angular/router';

export interface Product {
  productId: number;
  name: string;
  productCode: string;
  image: string;
  pdfLink:string;
  categoryId: number;
  brandId: number;
}

@Component({
  selector: 'app-brand-category-product',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './brand-category-product.component.html',
  styleUrl: './brand-category-product.component.css'
})
export class BrandCategoryProductComponent {
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

  getAllProducts(brandid:number,categoryID:number): void {
    const apiUrl = `http://localhost:5210/api/Product/${brandid}/${categoryID}/${this.currentPage}/${this.pageSize}`;
    this.httpClient.get<{count:number , products:Product[]}>(apiUrl)
      .subscribe({
        next: (data) => {
          this.Products.set(data.products); // Set the signal value
          this.totalProducts = data.count //
          this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
          console.log(this.totalPages)
          console.log(this.totalProducts)
          window.scrollTo(0,0)
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.brandid = +params['brandID']
      this.brandName = params['brandName']
      this.categoryID = +params['categoryID']
      this.categoryName = params['categoryName']
      this.getAllProducts(this.brandid,this.categoryID);
    })
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllProducts(this.brandid,this.categoryID);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllProducts(this.brandid,this.categoryID);
    }
  }

 

}
