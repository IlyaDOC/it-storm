import {Component, Input, OnInit,} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ActionType} from "../../../../types/action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserActionsResponseType} from "../../../../types/user-actions.response.type";
import {CommentsType} from "../../../../types/comments.type";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentType;
  @Input() articleId: string = '';
  public isLogged: boolean = false;
  protected readonly ActionType = ActionType;
  public comments: CommentType[] = [];

  constructor(private authService: AuthService,
              private commentService: CommentService,
              private _snackBar: MatSnackBar) {
    this.comment = {
      id: '',
      text: '',
      date: '',
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: '',
        name: ''
      },
      liked: false,
      disliked: false,
    }
    this.comments = [{
      id: '',
      text: '',
      date: '',
      likesCount: 0,
      dislikesCount: 0,
      user: {
        id: '',
        name: ''
      },
      liked: false,
      disliked: false,
    }]

    this.isLogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });
  }


  // Функционал клика по кнопкам комментария
  commentAction(commentId: string, action: ActionType): void {
    if (this.isLogged && commentId && action) {
      // Отправляем запрос на добавление и удаление реакции к комментарию из БД
      this.commentService.applyAction(commentId, action)
        .subscribe({
          next: ((data: DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error) {
              error = (data as DefaultResponseType).message;
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }
            const actionType = ActionType;

            if (action === actionType.violate) {
              this._snackBar.open('Жалоба отправлена');
            } else {
              this._snackBar.open('Ваш голос учтен!');
            }


            // Запросить данные о действиях к комментарию у пользователя
            this.commentService.getActionsForComment(this.comment.id)
              .subscribe({
                next: (data: DefaultResponseType | UserActionsResponseType[]) => {
                  let error = null;

                  if ((data as DefaultResponseType).error) {
                    error = (data as DefaultResponseType).message;
                  }

                  if (error) {
                    this._snackBar.open(error);
                    throw new Error(error);
                  }
                  let commentActions = data as UserActionsResponseType[];

                  this.comment = {
                    ...this.comment,
                    liked: commentActions.some(action => action.comment === this.comment.id && action.action === 'like'),
                    disliked: commentActions.some(action => action.comment === this.comment.id && action.action === 'dislike'),
                  }

                  // Запросить все комментарии, чтобы обновить количество лайков и дизлайков

                  this.commentService.getComments(this.articleId, 0)
                    .subscribe((data: CommentsType) => {
                      data.comments.forEach(comment => {
                        if (comment.id === this.comment.id) {
                          this.comment.likesCount = comment.likesCount;
                          this.comment.dislikesCount = comment.dislikesCount;
                        }
                      })
                    });
                },
                error: (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.error && errorResponse.error.message) {
                    this._snackBar.open(errorResponse.error.message);
                  } else {
                    this._snackBar.open('Ошибка отправки реакции');
                  }
                }
              })
          }),
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              if (errorResponse.error.message === 'Это действие уже применено к комментарию') {
                errorResponse.error.message = 'Жалоба уже отправлена';
              }
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки реакции');
            }
          }
        })
    }
  };

}
