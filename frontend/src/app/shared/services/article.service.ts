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

  /** Запрос на получение популярных статей. В ответ получаем 4 самые популярные статьи */
  getPopularArticles():Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/top');
  }

  /** Запрос на получение всех статей. В параметрах можно передавать категории а также страницу пагинации.
   * Возвращает количество всех статей, количество страниц, а также массив статей. */
  getArticles(params: ActiveParamsType):Observable<{count: number, pages: number, items: ArticleCardType[]}> {
    return this.http.get<{count: number, pages: number, items: ArticleCardType[]}>(environment.api + 'articles', {
      params: params
    });
  }

  /** Запрос на получение всех статей. В параметрах можно передавать категории а также страницу пагинации.
   * Возвращает количество всех статей, количество страниц, а также массив статей. */
  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }


  /** Запрос на получение связанных статей для определенной статьи. В ответ получаем 2 статьи */
  getRelatedArticlesCards(url: string): Observable<ArticleCardType[]> {
    return this.http.get<ArticleCardType[]>(environment.api + 'articles/related/' + url);
  }


}
