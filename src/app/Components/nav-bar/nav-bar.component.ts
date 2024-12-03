import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

declare var bootstrap: any;

export interface Brand {
  brandID: number;
  brandName: string;
  image: string;
  categoryIDs: number[];
}

export interface Category {
  categoryID: number;
  categoryName: string;
  image: string;
  brandIDs: number[];
}

export interface Product {
  productId: number;
  name: string;
  productCode: string;
  image: string;
  brandId: number;
  categoryId: number;
}


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  selectedSearchType: string = 'product'; // Default search type is product
  searchText: string = '';
  apiUrl:string ='';
  

  public Products = signal<Product[]>([]);
  public Categories = signal<Category[]>([]);
  public Brands = signal<Brand[]>([]);


  constructor(private router: Router) { }
  isHome(): boolean {
    return this.router.url === '/';
  }

  http = inject(HttpClient)

  onSearchSubmit() {
    if (!this.searchText) {
      alert("Please enter search text.");
      return;
    }


    switch (this.selectedSearchType) {
      case 'category':
        this.apiUrl = `http://localhost:5210/api/Category/${this.searchText}`;
        this.getCategory();
        break;
      case 'brand':
        this.apiUrl = `http://localhost:5210/api/Brand/${this.searchText}`;
        this.getBrand();
        break;
      case 'product':
        this.apiUrl = `http://localhost:5210/api/Product/${this.searchText}/GetByName`;
        this.getProduct();
        break;
      case 'productCode':
        this.apiUrl = `http://localhost:5210/api/Product/${this.searchText}`;
        this.getProduct();
        break;
      default:
        alert('Invalid search type selected.');
        return;
    }

  

    

    this.http.get(this.apiUrl).subscribe(
      (response: any) => {
        // Navigate to the appropriate page based on search type
        switch (this.selectedSearchType) {
          case 'category':
            this.router.navigate(['/categories'], { queryParams: { search: this.searchText } });
            break;
          case 'brand':
            this.router.navigate(['/brands'], { queryParams: { search: this.searchText } });
            break;
          case 'product':
            this.router.navigate(['/products'], { queryParams: { search: this.searchText } });
            break;

            case 'productCode':
              this.router.navigate(['/products'], { queryParams: { productCode: this.searchText } });
              break;
            default:
              break;
          }
        },
        (error) => {
          console.error('Error searching for data:', error);
          alert('Error performing search. Please try again.');
        }
      );
    }


    getProduct(): void {
      this.http.get<Product[]>(this.apiUrl)
        .subscribe({
          next: (data) => {
            this.Products.set(data); // Set the signal value
          },
          error: (err) => {
            console.error('Error fetching Products:', err);
          }
        });
    }

    getCategory(): void {
      this.http.get<Category[]>(this.apiUrl)
        .subscribe({
          next: (data) => {
            this.Categories.set(data); // Set the signal value
          },
          error: (err) => {
            console.error('Error fetching Categories:', err);
          }
        });
    }


    getBrand(): void {
      this.http.get<Brand[]>(this.apiUrl)
        .subscribe({
          next: (data) => {
            this.Brands.set(data); // Set the signal value
          },
          error: (err) => {
            console.error('Error fetching Brands:', err);
          }
        });
    }
  

  }
