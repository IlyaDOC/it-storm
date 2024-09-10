import {Component, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ActionType} from "../../../../types/action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserActionsResponseType} from "../../../../types/user-actions.response.type";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!: CommentType;
  @Input() articleId!: string;
  public isLogged: boolean = false;
  protected readonly ActionType = ActionType;

  constructor(private authService: AuthService, private commentService: CommentService, private _snackBar: MatSnackBar) {
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

      // this.comment.liked = !this.comment.liked;
      // if (this.comment.liked) {
      //   this.comment.disliked = false; // Снимаем dislike, если поставили like
      // }
      //
      // this.comment.disliked = !this.comment.disliked;
      // if (this.comment.disliked) {
      //   this.comment.liked = false; // Снимаем like, если поставили dislike
      // }

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
            this._snackBar.open((data as DefaultResponseType).message);

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
                  console.log(commentActions);
                  this.comment = {
                    ...this.comment,
                    liked: commentActions.some(action => action.comment === this.comment.id && action.action === 'like'),
                    disliked: commentActions.some(action => action.comment === this.comment.id && action.action === 'dislike')
                  }
                }
              })

            // Запросить все комментарии, чтобы получить количество лайков и дизлайков

          }),
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки реакции');
            }
          }
        })

      // Повторно запросить реакции пользователя, чтобы изменить состояние кнопок

    }
  };

  // commentResponse(commentId: string) {
  //   this.commentService.getActionsForUser(commentId)
  //     .subscribe({
  //       next: (data: DefaultResponseType | UserActionsResponseType[]) => {
  //         let error = null;
  //         if ((data as DefaultResponseType).error) {
  //           error = (data as DefaultResponseType).message;
  //         }
  //         if (error) {
  //           this._snackBar.open(error);
  //           throw new Error(error);
  //         }
  //         this._snackBar.open((data as DefaultResponseType).message);
  //
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         if (error.error && error.error.message) {
  //           this._snackBar.open(error.error.message);
  //         } else {
  //           this._snackBar.open('Ошибка отправки реакции');
  //         }
  //       }
  //     })
  // }
}
