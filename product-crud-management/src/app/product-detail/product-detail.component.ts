import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;

    if (id !== null) {
      this.productService.getProduct(id).subscribe({
        next: (prod) => {
          this.product = prod;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Could not load product.';
          this.loading = false;
          console.error(err);
        },
      });
    } else {
      this.errorMessage = 'Invalid product ID.';
      this.loading = false;
    }
  }
}
