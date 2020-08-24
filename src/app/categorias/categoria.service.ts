import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from './../core/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private route = 'http://localhost:8080/categorias';

  private headers = new HttpHeaders()
        .set('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
        .set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  pesquisarTodas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.route}`, {headers: this.headers}).pipe(
      map(res => res)
    );
  }
}
