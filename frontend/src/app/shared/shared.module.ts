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
import {ReactiveFormsModule} from "@angular/forms";
import {PhoneMaskDirective} from "../directives/phone-mask.directive";
import { SuccessPopupComponent } from './components/success-popup/success-popup.component';
import { OrderPopupComponent } from './components/order-popup/order-popup.component';


@NgModule({
  declarations: [
    ServiceItemComponent,
    SpaceSeparatedNumberPipe,
    ArticleCardComponent,
    CatalogFilterComponent,
    BreadcrumbsComponent,
    DateFormatPipe,
    CommentComponent,
    ConsultationPopupComponent,
    PhoneMaskDirective,
    SuccessPopupComponent,
    OrderPopupComponent
  ],
  exports: [
    ServiceItemComponent,
    ArticleCardComponent,
    CatalogFilterComponent,
    BreadcrumbsComponent,
    DateFormatPipe,
    CommentComponent,
    ConsultationPopupComponent,
    PhoneMaskDirective,
    SuccessPopupComponent,
    OrderPopupComponent
  ],
  imports: [
    CommonModule,
    RouterLinkWithHref,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
