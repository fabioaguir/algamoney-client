
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ErrorHandlerService } from './../core/error-handler.service';
import { NotAuthenticatedError } from '../core/not-authenticated-error';

@Injectable()
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  tokensRenokeUrl = 'http://localhost:8080/tokens/revoke';
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private errorHandler: ErrorHandlerService
  ) {
    this.carregarToken();
  }

  login(usuario: string, senha: string): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true }).pipe(
      map((response: any) => this.armazenarToken(response.access_token)),
      catchError(async (response) => {
        if (response.error?.error === 'invalid_grant') {
          this.errorHandler.handle('Usuário ou senha inválida');
        }

        this.errorHandler.handle(response);
      })

    );
  }

  obterNovoAccessToken(): Observable<void> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true }).pipe(
      map((response: any) => this.armazenarToken(response.access_token)),
      catchError(async (response) => {
        if (response.error?.error === 'invalid_grant') {
          this.errorHandler.handle('Erro ao renovar token');
        } else if (response.error?.error === 'invalid_token') {
          this.errorHandler.handle(new NotAuthenticatedError());
        } else {
          this.errorHandler.handle(response);
        }
      })

    );
  }

  logout() {
    return this.http.delete(this.tokensRenokeUrl, { withCredentials: true }).pipe(
      map((response: any) => this.limparAccessToken()),
      catchError(async (response) => {
        this.errorHandler.handle(response);
      })
    );
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      return this.temPermissao(role);
    }
  }

  armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }
}
