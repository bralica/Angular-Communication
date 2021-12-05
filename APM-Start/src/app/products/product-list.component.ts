import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewChildren, QueryList} from '@angular/core';

import { IProduct } from './product';
import { ProductService } from './product.service';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
    pageTitle: string = 'Product List';
    showImage: boolean;
    listFilter: string;
    imageWidth: number = 50;
    imageMargin: number = 2;
    errorMessage: string;

    filteredProducts: IProduct[];
    products: IProduct[];

    private _sub$: Subscription;


    @ViewChild('filterElement') filterElementRef: ElementRef;
    // @ViewChild(NgModel) filterInput: NgModel;
    private _filterInput: NgModel;

    get filterInput(): NgModel {
      return this._filterInput;
    }

    @ViewChild(NgModel)
    set filterInput(value: NgModel) {
      this._filterInput = value;
      console.log('filterInput before: ', this.filterInput);
      if (this.filterInput && !this._sub$) {
        console.log('Subscribing: ', this.filterInput);
        this._sub$ = this.filterInput.valueChanges.subscribe(
          () => {
            this.performFilter(this.listFilter);
            console.log('Perform the filter: ', this.filterInput);

          }
        );
      }
      if (this.filterInput) {
        this.filterElementRef.nativeElement.focus();
      }
    }


    constructor(private productService: ProductService) {}

    ngAfterViewInit(): void {
        // this.filterInput.valueChanges.subscribe(
        //   () => {
        //     this.performFilter(this.listFilter);
        //   }
        // );

    }

    ngOnInit(): void {
        this.productService.getProducts().subscribe(
            (products: IProduct[]) => {
                this.products = products;
                this.performFilter(this.listFilter);
            },
            (error: any) => this.errorMessage = <any>error
        );
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    performFilter(filterBy?: string): void {
        if (filterBy) {
            this.filteredProducts = this.products.filter((product: IProduct) =>
                product.productName.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !== -1);
        } else {
            this.filteredProducts = this.products;
        }
    }
}
