import {Injectable} from '@angular/core';
import {CommentsType} from "../../../types/comments.type";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ActionType} from "../../../types/action.type";
import {UserActionsResponseType} from "../../../types/user-actions.response.type";


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}

  /** Запрос на загрузку комментариев к статье. Передаем количество комментариев, которые надо пропустить, а также id статьи */
  getComments(articleId: string, offset: number = 3,): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', {
      params: {
        offset: offset,
        article: articleId
      }
    });
  };
  /** Запрос на добавление нового комментария. Необходимо передавать авторизационный заголовок с access токеном. В ответ получаем DefaultResponse */
  addComment(text: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: articleId
    });
  }

  /** Запрос на применение действия для комментария. Возможные варианты для action в body: like, dislike, violate.
   * Необходимо передавать авторизационный заголовок с access токеном. В ответ получаем DefaultResponse */
  applyAction(commentId: string, action: ActionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    });
  };

  /** Запрос на получение действий пользователя для всех комментариев в рамках одной статьи.
    Необходимо передавать авторизационный заголовок с access токеном.
   В ответ получаем DefaultResponse в случае неудачи, либо же массив действий пользователя (кроме violate) для комментариев. */
  getActionsForUser(articleId: string): Observable<DefaultResponseType | UserActionsResponseType[]> {
    return this.http.get<DefaultResponseType | UserActionsResponseType[]>(environment.api + 'comments/article-comment-actions', {
      params: {
        articleId: articleId
      }
    })
  };

  /** Запрос на получение действий пользователя для комментария. Необходимо передавать авторизационный заголовок с access токеном.
   В ответ получаем DefaultResponse в случае неудачи, либо же массив действий пользователя (кроме violate) */
  getActionsForComment(commentId: string): Observable<DefaultResponseType | UserActionsResponseType[]> {
    return this.http.get<DefaultResponseType | UserActionsResponseType[]>(environment.api + 'comments/' + commentId + '/actions')
  }
}
