import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../../core/notification-service";
import { Item } from "../shared/item";
import { ItemService } from "../shared/item.service";
import { ItemsService } from "../shared/items.service";

@Component({
  selector: 'gsl-item-labels',
  templateUrl: './item-labels.component.html',
  styleUrls: ['./item-labels.component.css'],
  inputs: ['item'],
})
export class ItemLabelsComponent implements OnInit {
  item: Item;

  category: string;
  categories: Array<string> = [];

  categoryFields: Array<any> = [];
  data: Object;
  previewImage;

  constructor(
    private notificationService: NotificationService,
    private itemService: ItemService,
    private itemsService: ItemsService) { }

  ngOnInit() {
    this.item = this.itemService.get();
    this.loadCategories(this.item);
  }

  updateFields(item, category) {
    this.itemsService.getLabelCategoryFields(item, category)
      .subscribe(
        fields => {
          for (let field of fields) {
            field.templateOptions['change'] = ($viewValue, $modelValue, $scope) => {
              this.updatePreview(this.item, this.category, this.data);
            };
          }
          this.categoryFields = fields;
          this.data = {};
        },
        error => {
          this.notificationService.showError(error.data.status);
        }
      );
  };

  updatePreview(item, category, data) {
    this.itemsService.getLabelPreviewImage(item, category, data)
      .subscribe(
        image => {
          this.previewImage = image;
        }
      );
  };

  onCategoryChange(item, category) {
    this.updateFields(item, category);
    this.updatePreview(item, category, this.data);
  };

  loadCategories(item) {
    this.itemsService.getLabelCategories(this.item)
      .subscribe(
        categories => {
          this.categories = categories;
          this.category = this.categories[0];
          this.onCategoryChange(this.item, this.category);
        },
        error => {
          this.notificationService.showError(error.data.status);
        }
      );
  };

  printLabel(item, category, data) {
    this.itemsService.printLabel(item, category, data)
      .subscribe(
        data => {
          this.notificationService.show(data.status);
        },
        error => {
          this.notificationService.showError(error.data.status);
        }
      );
  };
}
