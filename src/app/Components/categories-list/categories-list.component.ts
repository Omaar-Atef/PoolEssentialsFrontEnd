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
  selector: 'app-categories-list',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {
  currentPage = 1;
  pageSize = 9;
  totalCategories = 0;
  totalPages = 0;

  httpClient = inject(HttpClient);
  router = inject(Router);

  public Categories = signal<Category[]>([]);

  
  getAllCategories(): void {
    
    const apiUrl = `http://localhost:5210/api/Category/${this.currentPage}/${this.pageSize}`;
    
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
    this.getAllCategories();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllCategories();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllCategories();
    }
  }

  goToProducts(categoryID: number,categoryName:string): void {
    this.router.navigate(['/categories/PrdInCat',categoryID,categoryName]);
  }

  
}
