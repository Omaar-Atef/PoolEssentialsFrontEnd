import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  pdfLink:string;
  brandId: number;
  categoryId: number;
}


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  formType: string = '';
  actionType: string = '';
  categoryName: string = '';
  brandName: string = '';
  brandImage: string = '';
  categoryImage: string = '';
  name: string = '';
  productCode: string = '';
  image: string = '';
  brandId: number = 0;
  categoryId: number = 0;
  productId: number = 0;
  selectedCategoryImage: File | null = null;
  selectedBrandImage: File | null = null;
  brands: Brand[] = [];
  categories: Category[] = [];
  selectedBrandIds: number[] = [];
  selectedCategoryIds: number[] = [];
  products: Product[] = [];
  isAuthenticated: boolean = false;
  displayEdit: boolean = true;
  editMode: boolean = false;
  filename:string = '';
  pdfLink:string='';

  username: string = '';
  password: string = '';

  validUsername: string = 'abdo';
  validPassword: string = '3775236';

  // validUsername: string = '1';
  // validPassword: string = '1';

  showCategoryList = false;
  showBrandList = false;
  showProductList = false;

  httpclient = inject(HttpClient)

  openForm(form: string) {
    this.formType = form;
  }

  handleAction(action: string) {
    this.actionType = action;
    if (this.formType === 'category' && this.actionType === 'add') {
      this.getBrands();
    }
    else if (this.formType === 'product' && this.actionType === 'add') {
      this.getBrands();
      this.getCategories();
    }
    else if (this.formType === 'brand' && this.actionType === 'delete') {
      this.getBrands();
    }
    else if (this.formType === 'category' && this.actionType === 'delete') {
      this.getCategories();
    }
    else if (this.formType === 'product' && this.actionType === 'delete') {
      this.getProducts();
    }
    else if (this.formType === 'product' && this.actionType === 'edit') {
      this.getProducts();
      this.displayEdit = true;
      this.editMode = false;
    }
    else if (this.formType === 'category' && this.actionType === 'edit') {
      this.getCategories();
      this.displayEdit = true;
      this.editMode = false;
    }
    else if (this.formType === 'brand' && this.actionType === 'edit') {
      this.getBrands();
      this.displayEdit = true;
      this.editMode = false;
    }
  }

  // onImageChange(event: any, type: string) {
  //   if (type === 'category') {
  //     this.selectedCategoryImage = event.target.files[0];
  //   } else if (type === 'brand') {
  //     this.selectedBrandImage = event.target.files[0];
  //   }
  // }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCategoryImage = file;
    }
  }


  getCategoryDetails() {
    return {
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      // image:this.categoryImage,
      image: this.filename,
      brandIds: this.selectedBrandIds
    };
  }

  uploadImage(): void {
    if (this.selectedCategoryImage) {
      const formData = new FormData();
      formData.append('image', this.selectedCategoryImage);
  
      this.httpclient.post('http://localhost:5210/api/Category/Upload', formData)
        .subscribe({
          next: (res: any) => {
            // Use the filename returned by the API response
            this.image = res.fileName; // Store the returned image path (e.g., /images/filename.jpg)
            this.filename = res.fileName;  // This is the image filename saved in the database
            console.log('Uploaded image filename:', this.filename);
          },
          error: (err: any) => {
            console.error('Error occurred:', err);
          }
        });
    }
  }
  

async submitCategory() {
  const formData = this.getCategoryDetails();
  formData.image = this.filename;  // Use the image filename returned by the server

  this.httpclient.post('http://localhost:5210/api/Category', formData).subscribe({
    next: (res: any) => {
      alert('Category added successfully');
      this.resetForm();
    },
    error: (err: any) => {
      console.error('Error:', err);
      alert('Error adding Category');
    }
  });
}


  getBrandDetails() {
    return {
      brandId: this.brandId,
      brandName: this.brandName,
      // image: this.brandImage,
      image:this.filename,
      categoryIds: this.selectedCategoryIds
    };
  }


  submitBrand() {
    // if (!this.brandName || !this.selectedBrandImage) {
    //   alert('Please fill in all fields.');
    //   return;
    // }

    const formData = this.getBrandDetails();
    this.httpclient.post('http://localhost:5210/api/Brand', formData).subscribe({
      next: (res: any) => {
        alert('Brand added successfully');
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Error:', err);
        alert('Error adding brand');
      }
    });
  }

  getProductDetails() {
    return {
      name: this.name,
      productCode: this.productCode,
      // image: this.image,
      image:this.filename,
      categoryId: this.categoryId,
      brandId: this.brandId,
      pdfLink:this.pdfLink
    };
  }
  submitProduct() {
    // if (!this.brandName || !this.selectedBrandImage) {
    //   alert('Please fill in all fields.');
    //   return;
    // }

    const formData1 = this.getProductDetails();
    console.log(formData1)
    this.httpclient.post('http://localhost:5210/api/Product', formData1).subscribe({
      next: (res: any) => {
        alert('Product added successfully');
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Error:', err);
        alert('Error adding Product');
      }
    });
  }

  resetForm() {
    this.categoryName = '';
    this.brandName = '';
    this.selectedCategoryImage = null;
    this.selectedBrandImage = null;
    this.formType = '';
    this.actionType = 'add'; // Reset to 'add' after submission
    this.selectedBrandIds = [];
    this.selectedCategoryIds = [];
    this.brandId = 0;
    this.categoryId = 0;
    this.pdfLink = ''
  }

  getBrands(): void {
    const apiUrl = 'http://localhost:5210/api/Brand';
    this.httpclient.get<Brand[]>(apiUrl)
      .subscribe({
        next: (data: Brand[]) => {
          this.brands = (data); // Set the signal value
        },
        error: (err) => {
          console.error('Error fetching Brands:', err);
        }
      });
  }

  getCategories(): void {
    const apiUrl = 'http://localhost:5210/api/Category';
    this.httpclient.get<Category[]>(apiUrl)
      .subscribe({
        next: (data: Category[]) => {
          this.categories = (data); // Set the signal value
        },
        error: (err) => {
          console.error('Error fetching Categories:', err);
        }
      });
  }

  getProducts(): void {
    const apiUrl = 'http://localhost:5210/api/Product';
    this.httpclient.get<Product[]>(apiUrl)
      .subscribe({
        next: (data: Product[]) => {
          this.products = (data); // Set the signal value
        },
        error: (err) => {
          console.error('Error fetching Products:', err);
        }
      });
  }

  deleteCategory(categoryID: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      this.httpclient.delete(`http://localhost:5210/api/Category/${categoryID}`).subscribe({
        next: () => {
          alert('Category deleted successfully');
          this.getCategories(); // Refresh the category list
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          alert('Error deleting category');
        }
      });
    }
    else {
      this.getCategories();
    }

  }

  deleteBrand(brandID: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      this.httpclient.delete(`http://localhost:5210/api/Brand/${brandID}`).subscribe({
        next: () => {
          alert('Brand deleted successfully');
          this.getBrands(); // Refresh the brand list
        },
        error: (err) => {
          console.error('Error deleting brand:', err);
          alert('Error deleting brand');
        }
      });
    }
    else {
      this.getBrands();
    }

  }

  deleteProduct(productID: number) {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      this.httpclient.delete(`http://localhost:5210/api/Product/${productID}`).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.getProducts(); // Refresh the product list
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Error deleting product');
        }
      });
    }
    else {
      this.getProducts();
    }

  }

  ngOnInit() {
    // Ask for username and password when the page loads
    this.promptForCredentials();
  }
  promptForCredentials() {
    while (!this.isAuthenticated) {
      const enteredUsername = prompt('Enter Username:', '');
      const enteredPassword = prompt('Enter Password:', '');

      if (enteredUsername === this.validUsername && enteredPassword === this.validPassword) {
        this.isAuthenticated = true;
        alert('Login successful');
        break; // Exit the loop and allow the page to load
      } else {
        alert('Invalid credentials. Please try again.');
      }
    }
  }

  editCategory(categoryId: number) {
    this.httpclient.get<any>(`http://localhost:5210/api/Category/${categoryId}`).subscribe(data => {
      this.categoryId = data.categoryID
      this.categoryName = data.categoryName;
      this.image = data.image;
      this.selectedBrandIds = data.brandIDs;
      this.actionType = 'edit';
      this.formType = 'category';
      this.displayEdit = false;
      this.editMode = true;
      this.getBrands();
    });
  }

  editBrand(brandId: number) {
    this.httpclient.get<any>(`http://localhost:5210/api/Brand/${brandId}`).subscribe(data => {
      this.brandId = brandId;
      this.brandName = data.brandName;
      this.image = data.image;
      this.editMode = true;
      this.actionType = 'edit';
      this.formType = 'brand';
      this.displayEdit = false;
    });
  }

  editProduct(productId: number) {
    this.httpclient.get<any>(`http://localhost:5210/api/Product/${productId}`).subscribe(data => {
      this.productId = data.productId;
      this.name = data.name;
      this.productCode = data.productCode;
      this.image = data.image;
      this.pdfLink=data.pdfLink;
      this.brandId = data.brandId;
      this.categoryId = data.categoryId;
      this.actionType = 'edit';
      this.formType = 'product';
      this.displayEdit = false;
      this.editMode = true;
      this.getBrands();
      this.getCategories();
    });
  }

  submitCategoryEdit() {
    const updatedCategory = {
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      image: this.image,
      brandIds: this.selectedBrandIds
    };
    this.httpclient.put(`http://localhost:5210/api/Category`, updatedCategory).subscribe({
      next: () => {
        alert('Category updated successfully');
        this.getCategories(); // Refresh the category list
      },
      error: (err) => {
        console.error('Error updating category:', err);
        alert('Error updating category');
      }
    });
  }

  submitBrandEdit() {
    const updatedBrand = {
      brandId: this.brandId,
      brandName: this.brandName,
      image: this.image
    };
    this.httpclient.put(`http://localhost:5210/api/Brand/`, updatedBrand).subscribe({
      next: () => {
        alert('Brand updated successfully');
        this.getBrands(); // Refresh the brand list
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Error updating brand:', err);
        alert('Error updating brand');
      }
    });
  }

  submitProductEdit() {
    const updatedProduct = {
      productId: this.productId,
      name: this.name,
      productCode: this.productCode,
      image: this.image,
      pdfLink:this.pdfLink,
      brandId: this.brandId,
      categoryId: this.categoryId
    };
    this.httpclient.put(`http://localhost:5210/api/Product`, updatedProduct).subscribe({
      next: () => {
        alert('Product updated successfully');
        this.getProducts(); // Refresh the product list
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert('Error updating product');
      }
    });
  }

  cancelEdit() {
    this.editMode = false; // Disable edit mode
    this.brandName = '';
    this.brandImage = '';
    this.displayEdit = true; // Show the DisplayEdit section again
  }

}