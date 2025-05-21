import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
      category: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      this.productService.getProduct(this.productId).subscribe({
        next: (product) => this.productForm.patchValue(product),
        error: (err) => console.error('Failed to load product', err),
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const product: Product = {
      id: this.productId,
      ...this.productForm.value,
    };

    if (this.isEdit) {
      this.productService.updateProduct(product).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Update failed', err),
      });
    } else {
      this.productService.addProduct(product).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Add failed', err),
      });
    }
  }
}
