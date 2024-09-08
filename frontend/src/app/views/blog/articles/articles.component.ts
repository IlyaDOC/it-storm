import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleCardType} from "../../../../types/article-card.type";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoryType} from "../../../../types/category.type";
import {CategoriesService} from "../../../shared/services/categories.service";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  public articles: ArticleCardType[] = [];
  public activeParams: ActiveParamsType = {categories: []};
  public appliedFilters: AppliedFilterType[] = [];
  public categories: CategoryType[] = [];
  public pages: number[] = [];


  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (!params['page']) {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { page: 1 },
          queryParamsHandling: 'merge'
        });
      }
    });

    this.categoriesService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;

        this.activatedRoute.queryParams.subscribe(params => {
          this.activeParams = ActiveParamsUtil.processParams(params);
          this.appliedFilters = [];

          this.activeParams.categories.forEach(url => {
            const foundCategory = this.categories.find(category => category.url === url);
            if (foundCategory) {
              this.appliedFilters.push({
                name: foundCategory.name,
                urlParams: foundCategory.url
              })
            }
          })

          this.articleService.getArticles(this.activeParams)
            .subscribe(data => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
              this.articles = data.items;
            });
        });
      });



  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParams);
    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }
}
