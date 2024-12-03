import { ChangeDetectionStrategy,Component, OnInit , inject ,signal} from '@angular/core';
import { HttpClient , HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // for error handling in the HTTP request
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterOutlet ,Router } from '@angular/router';

export interface Brand {
  brandID: number;
  brandName: string;
  image: string;
  categoryIDs: number[];
}

@Component({
  selector: 'app-products-home',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule,RouterLink,RouterOutlet],
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsHomeComponent {

  httpClient = inject(HttpClient);
  changeDetectorRef = inject(ChangeDetectorRef);
  router = inject (Router)


  public Brands = signal<Brand[]>([]);
  groupedBrands: Brand[][]=[];

  
  getAllBrands(): void {
    this.httpClient.get<Brand[]>('http://localhost:5210/api/Brand')
      .subscribe({
        next: (data: Brand[]) => {
          this.Brands.set(data); // Set the signal value
          this.groupBrands(); // Group categories after setting the signal value
          this.changeDetectorRef.markForCheck(); // Manually trigger change detection (especially useful with OnPush)
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });
  }

  
  ngOnInit() {
    this.getAllBrands();
    window.onresize = () => {
      this.groupBrands();
    };
  }

  groupBrands(): void {
    const groupSize = this.getGroupSize(); // Get group size based on screen width
    const brands = this.Brands(); // Access the current value of the signal
    this.groupedBrands = []; // Reset grouped categories array

    // Group categories based on the group size
    for (let i = 0; i < brands.length; i += groupSize) {
      this.groupedBrands.push(brands.slice(i, i + groupSize));
    }
  }

  getGroupSize(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
      return 1; // 1 category per carousel slide for small screens
    } else if (screenWidth < 992) {
      return 2; // 2 categories per carousel slide for medium screens
    } else {
      return 3; // 3 categories per carousel slide for large screens
    }
  }

  goToCategories(brandID: number,brandName:string): void {
    this.router.navigate(['/categories/for-brand',brandID,brandName]);
  }
 

}
