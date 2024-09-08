import {Injectable} from '@angular/core';
import {CommentsType} from "../../../types/comments.type";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  public comments!: CommentsType;


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

  likeComment(commentId: string): Observable<any> {
    return this.http.post(`${environment.api}/comments/${commentId}/like`, {});
  }

  dislikeComment(commentId: string): Observable<any> {
    return this.http.post(`${environment.api}/comments/${commentId}/dislike`, {});
  }
}
