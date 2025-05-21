import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'price', 'quantity', 'actions'];

  currentPage: number = 1;
  rowsPerPage: number = 5;
  totalPages: number = 1;
  paginatedProducts: Product[] = [];

  searchText: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / this.rowsPerPage);
        this.paginate();
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
  }

  changePage(direction: number): void {
    this.currentPage += direction;

    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.paginate();
  }

  onSearch() {
    if (this.searchText.trim()) {
      this.productService.searchProducts(this.searchText).subscribe((data) => {
        this.products = data;
        this.totalPages = Math.ceil(this.products.length / this.rowsPerPage);
        this.currentPage = 1;
        this.paginate();
      });
    } else {
      this.loadProducts();
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => console.error('Failed to delete product', err),
    });
  }

  editProduct(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/product', id]);
  }
}
