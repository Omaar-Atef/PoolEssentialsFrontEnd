import { ChangeDetectionStrategy, Component, OnInit , inject ,signal} from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BrandCategoriesComponent } from '../brand-categories/brand-categories.component';


export interface Brand {
  brandID: number;
  brandName: string;
  image: string;
  categoryIDs: number[];
}

@Component({
  selector: 'app-brands-list',
  standalone: true,
  imports: [BrandCategoriesComponent,FormsModule,CommonModule,RouterLink,RouterOutlet],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsListComponent  {

  currentPage = 1;
  pageSize = 9;
  totalBrands = 0;
  totalPages = 0;

  httpClient = inject(HttpClient);
  changeDetectorRef = inject(ChangeDetectorRef);
  router = inject (Router)


  public Brands = signal<Brand[]>([]);

  
  getAllBrands(): void {
    const apiUrl = `http://localhost:5210/api/Brand/${this.currentPage}/${this.pageSize}`;
    this.httpClient.get<{count:number,brands:Brand[]}>(apiUrl)
      .subscribe({
        next: (data) => {
          this.Brands.set(data.brands); 
          this.totalBrands = data.count
          this.totalPages = Math.ceil(this.totalBrands / this.pageSize);
          this.changeDetectorRef.markForCheck();
          window.scrollTo(0,0)
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });
  }

  
  ngOnInit() {
    this.getAllBrands();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getAllBrands();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllBrands();
    }
  }

  
  goToCategories(brandID: number,brandName:string): void {
    this.router.navigate(['/categories/for-brand',brandID,brandName]);
  }
 
}
