import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../model/category';
import {ProductService} from '../../service/product.service';
import {Product} from '../../model/Product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: Category[];
  products: Product[] = [];
  totalElements: number;
  page: any;
  totalPage;
  public role: string;

  constructor(private categoryService: CategoryService,
              private productService: ProductService) {
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getNewProducts();
    this.getAllproduct();
    if (this.totalElements === 1) {
      this.products.length = 0;
    }
    if (this.totalElements>= this.products.length) {
this.products.length =0;
    }
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(value => {
      this.categories = value;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.categories.length; i++) {
        this.categories[i].totalProduct = this.categories[i].productList.length;
      }
    });
  }

  getNewProducts() {
    this.productService.getNewProducts().subscribe(value => {
      this.products = value;
    });
  }

  getAllproduct() {
    this.productService.getAllPageProducts(this.page).subscribe((value: any) => {
      if (value != null) {
        this.products = value.content;
        this.totalElements = value.totalElements;
        this.page = value.totalPage;
      }
    })
  }
  getPage(event: number) {
    this.page = event - 1;
    this.getAllproduct();
  }
}
