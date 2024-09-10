import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SignupResponseType} from "../../../types/signup-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  /** Запрос на авторизацию пользователя. В ответ получаем либо ответ с токенами, либо ответ с ошибкой DefaultResponse */
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email: email,
      password: password,
      rememberMe: rememberMe
    });
  };

  /** Запрос на регистрацию пользователя. В ответ получаем либо ответ с токенами (авторизованный пользователь), либо ответ с ошибкой DefaultResponse */
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | SignupResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name: name,
      email: email,
      password: password,
    });
  };

  /** Запрос на разлогинивание пользователя. В ответ получаем либо успешный стандартный ответ DefaultResponse, либо ответ с ошибкой DefaultResponse */
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(()=> 'Can not find token');
  };

  /** Запрос на обмен access токена по refresh токену. В ответ получаем либо ответ с токенами, либо ответ с ошибкой DefaultResponse */
  refresh():Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }

    throw throwError(()=> 'Can not use token');
  }

  public getIsLoggedIn() {
    return this.isLogged;
  };

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  };

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  };


  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  };

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  };

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  };

}
