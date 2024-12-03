import { Component, OnInit , inject ,signal} from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute ,Router} from '@angular/router';

export interface Category {
  categoryID: number;
  categoryName: string;
  image: string;
  brandIDs: number[];
}

@Component({
  selector: 'app-brand-categories',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './brand-categories.component.html',
  styleUrl: './brand-categories.component.css'
})
export class BrandCategoriesComponent {
  currentPage = 1;
  pageSize = 9;
  totalCategories = 0;
  totalPages = 0;
  brandid = 0;
  brandName= ""

  httpClient = inject(HttpClient);
  route = inject(ActivatedRoute)
  router = inject(Router)

  public Categories = signal<Category[]>([]);

  getAllCategories(brandid:number): void {
    const apiUrl = `http://localhost:5210/api/Category/${brandid}/${this.currentPage}/${this.pageSize}`;
    this.httpClient.get<{count:number , categories:Category[]}>(apiUrl)
      .subscribe({
        next: (data) => {
          this.Categories.set(data.categories); // Set the signal value
          this.totalCategories = data.count //
          this.totalPages = Math.ceil(this.totalCategories / this.pageSize);
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
      this.getAllCategories(this.brandid);
    })
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllCategories(this.brandid);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllCategories(this.brandid);
    }
  }

  goToProducts(brandID: number,brandName:string, categoryID:number, categoryName:string): void {
    this.router.navigate(['/categories/for-brand/for-category/',brandID,brandName,categoryID,categoryName]);
  }

}
