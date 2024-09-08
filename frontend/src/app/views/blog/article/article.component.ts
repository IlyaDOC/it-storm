import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public article!: ArticleType;
  public text!: string;
  public safeHtml!: SafeHtml;
  public relatedArticles!: ArticleCardType[];
  public isLogged: boolean = false;
  public comments!: CommentType[];
  public isLoading: boolean = false;
  public hasMoreComments: boolean = false;
  private offset: number = 3;
  private readonly limit: number = 10;

  public commentForm = this.fb.group({
    text: ['', Validators.required]
  });


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private articleService: ArticleService,
              private sanitizer: DomSanitizer,
              private authService: AuthService,
              private commentService: CommentService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar) {
    this.isLogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.text = this.article.text;
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.text);
          this.comments = this.article.comments;
          this.hasMoreComments = this.comments.length < this.article.commentsCount;
        });
    });

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getRelatedArticlesCards(params['url'])
        .subscribe((data: ArticleCardType[]) => {
          this.relatedArticles = data;
          console.log(this.relatedArticles);
        });
    });
  }

  getMoreComments(articleId: string, offset: number = 3): void {
    this.isLoading = true;
    this.offset += this.limit;
    this.commentService.getComments(articleId, offset)
      .subscribe((data: CommentsType) => {
        this.comments = [...this.article.comments, ...data.comments];
        this.hasMoreComments = this.comments.length < this.article.commentsCount;
      })
  };

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
            this._snackBar.open(data.message);
            this.updateComments();
          },

          error: (error: HttpErrorResponse) => {
            if (error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Ошибка отправки комментария')
            }
          }
        })
      this.commentForm.reset();
    }
  };


  updateComments() {
    this.activatedRoute.params.subscribe(params => {
      console.log('Произошел запрос')
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.comments = data.comments;
        });
    });
    this.hasMoreComments = this.comments.length < this.article.commentsCount;
  }
}
