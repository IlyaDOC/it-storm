import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleComponent } from './article/article.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleComponent,
  ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class BlogModule { }
