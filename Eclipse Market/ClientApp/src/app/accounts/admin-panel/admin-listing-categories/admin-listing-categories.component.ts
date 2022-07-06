import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IListingCategories, IListingCategory } from 'src/app/_models/listing-category.model';
import { ListingCategoryService } from 'src/app/_services/listing-category.service';

@Component({
  selector: 'app-admin-listing-categories',
  templateUrl: './admin-listing-categories.component.html',
  styleUrls: ['./admin-listing-categories.component.scss']
})
export class AdminListingCategoriesComponent implements OnInit {
  @ViewChild('ct') categoriesTable!: any;

  categoryList: IListingCategories = [];
  categoryAddDialog?: boolean;
  categoryEditDialog?: boolean;
  categoriesChanged: boolean = false;


  categoryGetSubs: Subscription | undefined;
  categoryAddSubs: Subscription | undefined;
  categoryEditSubs: Subscription | undefined;
  categoryDeleteSubs: Subscription | undefined;

  constructor(private listingCategoryService: ListingCategoryService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.fetchCategories();
    this.categoryAddDialog = false;
    this.categoryEditDialog = false;
  }

  applyFilterGlobal($event: Event, stringVal: any) {
    this.categoriesTable.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  categoryForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required])
  });

  fetchCategories() {
    if(!this.listingCategoryService.categories || this.categoriesChanged) {
      this.categoryGetSubs = this.listingCategoryService.getAll().subscribe({
        next: (resp: IListingCategories) => {
          this.listingCategoryService.categories = resp;
          this.categoryList = resp;
          this.categoriesChanged = false;
        },
        error: err => {
          console.log(err);
        }
      })
    } else {
      this.categoryList = this.listingCategoryService.categories;
    }
  }



  onToggleCategoryAddDialog() {
    this.categoryAddDialog = true;
    this.categoryForm.reset();
  }

  onAddCategory() {
    const body = {
      'Title': this.categoryForm.get('title')?.value
    }
    this.categoryAddSubs = this.listingCategoryService.add(body).subscribe({
      complete: () => {
        this.categoriesChanged = true;
        this.messageService.add({severity:'success', detail: 'Категорията е добавена успешно!', life: 3000});
        this.fetchCategories();
        this.categoryAddDialog = false;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  onDiscard() {
    this.categoryAddDialog = false;
    this.categoryEditDialog = false;
  }

  onToggleCategoryEditDialog() {
    this.categoryEditDialog = true;
    this.categoryForm.patchValue({

    })
  }

  onEditCategory() {
    
  }

  onDeleteCategory(categoryForDelete: IListingCategory) {
    const body = {
      'Id': categoryForDelete.id
    }
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете ${categoryForDelete.title} ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.categoryDeleteSubs = this.listingCategoryService.delete(body).subscribe({
          complete: () => {
            this.categoriesChanged = true;
            this.messageService.add({severity:'success', detail: 'Категорията е изтрита успешно!', life: 3000});
            this.fetchCategories();
          },
          error: err => {
            console.log(err)
          }
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.categoryGetSubs?.unsubscribe();
    this.categoryAddSubs?.unsubscribe();
    this.categoryEditSubs?.unsubscribe();
    this.categoryDeleteSubs?.unsubscribe();
  }

}
