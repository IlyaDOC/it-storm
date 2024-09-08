import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleCardType} from "../../../types/article-card.type";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }


  getPopularArticles():Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveParamsType):Observable<{count: number, pages: number, items: ArticleCardType[]}> {
    return this.http.get<{count: number, pages: number, items: ArticleCardType[]}>(environment.api + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }

  getRelatedArticlesCards(url: string): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/related/' + url);
  }


}
