import {Component, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../services/comment.service";
import {ActionType} from "../../../../types/action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment!: CommentType;
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

  commentAction(commentId: string, action: ActionType) {

    if (this.isLogged) {
      this.comment.liked = !this.comment.liked;
      if (this.comment.liked) {
        this.comment.disliked = false; // Снимаем dislike, если поставили like
      }
      this.commentResponse(commentId, action);
    }

    if (this.isLogged) {
      this.comment.disliked = !this.comment.disliked;
      if (this.comment.disliked) {
        this.comment.liked = false; // Снимаем like, если поставили dislike
      }

      this.commentResponse(commentId, action);
    }


  };

  commentResponse(commentId: string, action: ActionType) {
    this.commentService.commentAction(commentId, action)
      .subscribe({
        next: (data: DefaultResponseType) => {
          let error = null;
          if (data.error) {
            error = data.message;
          }
          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }
          this._snackBar.open(data.message);
        },
        error: (error: HttpErrorResponse) => {
          if (error.error && error.error.message) {
            this._snackBar.open(error.error.message);
          } else {
            this._snackBar.open('Ошибка отправки реакции');
          }
        }
      })
  }
}
