import {Component, HostListener, OnInit} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {CategoriesService} from "../../services/categories.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'app-catalog-filter',
  templateUrl: './catalog-filter.component.html',
  styleUrls: ['./catalog-filter.component.scss']
})
export class CatalogFilterComponent implements OnInit {
  public categories: CategoryType[] = []; // Переменная для хранения категорий
  public open = false; // Переменная отвечает за открытие и закрытие фильтра
  public activeIndexes: number[] = []; // Хранит в себе индекс категории, на которую кликаем
  public activeParams: ActiveParamsType = {categories: []};

  constructor(private categoriesService: CategoriesService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Запрос категорий
    this.categoriesService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;
      })

    // Если в роутинге есть query параметры фильтра, но при обновлении страницы
    // они будут отмечены как активные и фильтр будет оставаться открытым
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);

        if (params['articles']) {
          this.activeParams.categories = Array.isArray(params['articles']) ? params['articles'] : [params['articles']];
          this.open = true;
        }
      });
  }

  // Управление состоянием фильтра
  toggle() {
    this.open = !this.open;

  }

  // Отслеживание кликов по документу
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const filterElement = document.querySelector('.catalog__filter') as HTMLElement;

    // Проверяем, был ли клик вне компонента
    if (this.open && filterElement && !filterElement.contains(target)) {
      this.open = false; // Закрываем фильтр
    }
  }

  // Основной функционал фильтра категорий статей
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

  // Управление переключением категорий
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
