import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceItemComponent } from './components/service-item/service-item.component';
import { SpaceSeparatedNumberPipe } from './pipes/space-separated-number.pipe';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { CatalogFilterComponent } from './components/catalog-filter/catalog-filter.component';
import {RouterLinkWithHref} from "@angular/router";
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { CommentComponent } from './components/comment/comment.component';
import { ConsultationPopupComponent } from './components/consultation-popup/consultation-popup.component';



@NgModule({
  declarations: [
    ServiceItemComponent,
    SpaceSeparatedNumberPipe,
    ArticleCardComponent,
    CatalogFilterComponent,
    BreadcrumbsComponent,
    DateFormatPipe,
    CommentComponent,
    ConsultationPopupComponent
  ],
  exports: [
    ServiceItemComponent,
    ArticleCardComponent,
    CatalogFilterComponent,
    BreadcrumbsComponent,
    DateFormatPipe,
    CommentComponent,
    ConsultationPopupComponent
  ],
    imports: [
        CommonModule,
        RouterLinkWithHref
    ]
})
export class SharedModule { }
