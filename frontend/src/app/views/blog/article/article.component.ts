import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleCardType} from "../../../../types/article-card.type";
import {ArticleType} from "../../../../types/article.type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentsType} from "../../../../types/comments.type";
import {CommentType} from "../../../../types/comment.type";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserActionsResponseType} from "../../../../types/user-actions.response.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public article: ArticleType;
  public text: string = '';
  public safeHtml!: SafeHtml;
  public relatedArticles!: ArticleCardType[];
  public isLogged: boolean = false;
  public comments: CommentType[];
  public isLoading: boolean = false;
  public hasMoreComments: boolean = false;
  private offset: number = 3;
  private readonly limit: number = 10;
  public commentsActions: UserActionsResponseType[] = [];
  serverStaticPath = environment.serverStaticPath;
  public articleId: string = '';

  public commentForm = this.fb.group({
    text: ['', Validators.required]
  });

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private sanitizer: DomSanitizer,
              private authService: AuthService,
              private commentService: CommentService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar) {
    this.isLogged = authService.getIsLoggedIn();
    this.article = {
      text: '',
      comments: [
        {
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
      ],
      commentsCount: 0,
      id: '',
      title: '',
      description: '',
      image: '',
      date: '',
      category: '',
      url: ''
    }

    this.comments = [
      {
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
    ]
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    // Получение всех данных по одной статье
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.text = this.article.text;
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.text);
          this.comments = this.article.comments;
          this.hasMoreComments = this.comments.length < this.article.commentsCount;

          // Получаем действия залогиненного пользователя
          if (this.isLogged) {
            this.commentService.getActionsForUser(this.article.id)
              .subscribe({
                next: (data: UserActionsResponseType[] | DefaultResponseType) => {
                  let error = null;
                  if ((data as DefaultResponseType).error !== undefined) {
                    error = (data as DefaultResponseType).message;
                  }

                  if (error) {
                    this._snackBar.open(error);
                    throw new Error(error);
                  }

                  this.commentsActions = data as UserActionsResponseType[];

                  // Добавляем в коллекцию с комментариями свойства liked и disliked на основании данных пользователя
                  this.comments = this.comments.map((comment: CommentType) => {
                    const action = this.commentsActions.find(action => action.comment === comment.id);
                    return {
                      ...comment,
                      liked: action ? action.action === 'like' : false, // Добавляем состояние liked
                      disliked: action ? action.action === 'dislike' : false, // Добавляем состояние disliked
                    };
                  });
                },
                error: (errorResponse: HttpErrorResponse) => {
                  if (errorResponse.error && errorResponse.error.message) {
                    this._snackBar.open(errorResponse.error.message);
                  } else {
                    this._snackBar.open('Ошибка получения данных активности пользователя');
                  }
                }
              })
          }
        });
    });


    // Запрос на получение связанных статей
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getRelatedArticlesCards(params['url'])
        .subscribe((data: ArticleCardType[]) => {
          this.relatedArticles = data;
        });
    });
  }

  // Загрузка дополнительных комментариев по кнопке "Загрузить" ещё комментарии
  getMoreComments(articleId: string, offset: number = 3): void {
    this.isLoading = true;
    this.offset += this.limit;
    this.commentService.getComments(articleId, offset)
      .subscribe((data: CommentsType) => {
        this.comments = [...this.article.comments, ...data.comments];
        this.comments = this.comments.map((comment: CommentType) => {
          const action = this.commentsActions.find(action => action.comment === comment.id);
          return {
            ...comment,
            liked: action ? action.action === 'like' : false, // Добавляем состояние liked
            disliked: action ? action.action === 'dislike' : false // Добавляем состояние disliked
          };
        });

        this.hasMoreComments = this.comments.length < this.article.commentsCount;

      })
  };

  // Функционал добавления нового комментария
  addComment(): void {
    if (this.commentForm.valid && this.commentForm.value.text) {
      this.commentService.addComment(this.commentForm.value.text, this.article.id)
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

            this.updateLastComments();

            this.hasMoreComments = this.comments.length < this.article.commentsCount;
            this._snackBar.open(data.message)
            this.commentForm.reset();
          },

          error: (error: HttpErrorResponse) => {
            if (error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Ошибка отправки комментария')
            }
          }
        })
    }

  };

  // Обновляем список последних трех комментариев к статье, дополняя его новым
  updateLastComments(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.comments = data.comments;
          this.commentService.comments$.next(this.comments);
        });
    });

    this.hasMoreComments = this.comments.length < this.article.commentsCount;
  }
}
