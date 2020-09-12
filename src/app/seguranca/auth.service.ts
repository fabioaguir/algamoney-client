import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayload: string;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) {
      this.carregarToken();
     }

  login(usuario: string, senha: string): Observable<void> {
    const headers = new HttpHeaders()
        .set('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==')
        .set('Content-Type', 'application/x-www-form-urlencoded');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers }).pipe(
      map((response: any) => this.armazenarToken(response.access_token)),
      catchError(async (response) => console.log(response))
    );
  }

  armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  carregarToken() {
    const token = localStorage.getItem('token');

    if(token) {
      this.armazenarToken(token);
    }
  }
}
