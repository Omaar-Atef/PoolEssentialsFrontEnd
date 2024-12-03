import { ChangeDetectionStrategy,Component, OnInit , inject ,signal} from '@angular/core';
import { HttpClient , HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // for error handling in the HTTP request
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterOutlet,Router
 } from '@angular/router';



export interface Category {
  categoryID: number;
  categoryName: string;
  image: string;
  brandIDs: number[];
}

@Component({
  selector: 'app-category-home',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule,RouterLink,RouterOutlet],
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryHomeComponent implements OnInit {
  httpClient = inject(HttpClient);
  changeDetectorRef = inject(ChangeDetectorRef);
  router = inject (Router)


  public Categories = signal<Category[]>([]);
  groupedCategories: Category[][]=[];


 
  getAllCategories(): void {
    this.httpClient.get<Category[]>('http://localhost:5210/api/Category')
      .subscribe({
        next: (data: Category[]) => {
          this.Categories.set(data); // Set the signal value
          this.groupProducts(); // Group categories after setting the signal value
          this.changeDetectorRef.markForCheck(); // Manually trigger change detection (especially useful with OnPush)
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        }
      });
  }

  ngOnInit() {
    this.getAllCategories();
    window.onresize = () => {
      this.groupProducts();
    };
  }

  groupProducts(): void {
    const groupSize = this.getGroupSize(); // Get group size based on screen width
    const categories = this.Categories(); // Access the current value of the signal
    this.groupedCategories = []; // Reset grouped categories array

    // Group categories based on the group size
    for (let i = 0; i < categories.length; i += groupSize) {
      this.groupedCategories.push(categories.slice(i, i + groupSize));
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

  goToProducts(categoryID: number,categoryName:string): void {
    this.router.navigate(['/categories/PrdInCat',categoryID,categoryName]);
  }
}
