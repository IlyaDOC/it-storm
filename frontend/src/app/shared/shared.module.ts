import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceItemComponent } from './components/service-item/service-item.component';
import { SpaceSeparatedNumberPipe } from './pipes/space-separated-number.pipe';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import {RouterLinkWithHref} from "@angular/router";
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { CommentComponent } from './components/comment/comment.component';



@NgModule({
  declarations: [
    ServiceItemComponent,
    SpaceSeparatedNumberPipe,
    ArticleCardComponent,
    CategoryFilterComponent,
    BreadcrumbsComponent,
    DateFormatPipe,
    CommentComponent
  ],
  exports: [
    ServiceItemComponent,
    ArticleCardComponent,
    CategoryFilterComponent,
    BreadcrumbsComponent,
    DateFormatPipe,
    CommentComponent
  ],
    imports: [
        CommonModule,
        RouterLinkWithHref
    ]
})
export class SharedModule { }
