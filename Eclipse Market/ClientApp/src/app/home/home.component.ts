import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IListingCategories } from '../_models/listing-category.model';
import { IListing, IListingGetRecommended, IListingGetResponse } from '../_models/listing.model';
import { ListingCategoryService } from '../_services/listing-category.service';
import { ListingPreviewService } from '../_services/listing-preview.service';
import { ListingService } from '../_services/listing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categoryList: IListingCategories = [];
  categoryGetSubs?: Subscription;

  randomListingList?: IListingGetRecommended;
  randomListingGetSubs?: Subscription;


  constructor(private listingCategoryService: ListingCategoryService,
              private listingService: ListingService,
              private router: Router) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchRandomListings();
  }
  fetchCategories() {
    if(!this.listingCategoryService.categories) {
      this.categoryGetSubs = this.listingCategoryService.getAll().subscribe({
        next: (resp: IListingCategories) => {
          this.listingCategoryService.categories = resp;
          this.categoryList = resp;
        },
        error: err => {
          console.log(err);
        }
      })
    } else {
      this.categoryList = this.listingCategoryService.categories;
    }
  }

  fetchRandomListings() {
    this.randomListingGetSubs = this.listingService.getRecommended(1).subscribe({
      next: (resp: IListingGetRecommended) => {
        this.randomListingList = resp;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onSelectListing(listingForPreview: IListing) {
    this.router.navigate(['/listings/preview'], {queryParams: {id: listingForPreview.id}})
  }

  ngOnDestroy() {
    this.categoryGetSubs?.unsubscribe();
    this.randomListingGetSubs?.unsubscribe();
  }

}
