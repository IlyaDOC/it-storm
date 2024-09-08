import {Component, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {CategoriesService} from "../../services/categories.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  public categories: CategoryType[] = [];
  public open = false;
  public activeIndexes: number[] = [];
  public activeParams: ActiveParamsType = {categories: []};

  constructor(private categoriesService: CategoriesService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.categoriesService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;
      })

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        if (params['articles']) {
          this.activeParams.categories = Array.isArray(params['articles']) ? params['articles'] : [params['articles']];
          this.open = true;
        }
      });
  }

  toggle() {
    this.open = !this.open;
  }

  updateFilterParams(url: string, checked: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategory = this.activeParams.categories.find(item => item === url);
      if (existingCategory && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingCategory && checked) {
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  toggleItem(index: number, url: string) {
    const indexPosition = this.activeIndexes.indexOf(index);
    if (indexPosition > -1) {
      this.activeIndexes.splice(indexPosition, 1); // Удаляем индекс, если он уже активен
    } else {
      this.activeIndexes.push(index); // Добавляем индекс, если он не активен
    }

    this.updateFilterParams(url, this.activeIndexes.includes(index));
  }
}
