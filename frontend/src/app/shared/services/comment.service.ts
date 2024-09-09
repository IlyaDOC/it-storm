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

  constructor(private http: HttpClient) {
  }

  getComments(articleId: string, offset: number = 3,): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', {
      params: {
        offset: offset,
        article: articleId
      }
    });
  };

  addComment(text: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text,
      article: articleId
    });
  }

  commentAction(commentId: string, action: ActionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    });
  };

  getActionsForUser(articleId: string): Observable<DefaultResponseType | UserActionsResponseType[]> {
    return this.http.get<DefaultResponseType | UserActionsResponseType[]>(environment.api + 'comments/article-comment-actions', {
      params: {
        articleId: articleId
      }
    })
  };
}
