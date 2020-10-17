
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { Pessoa } from './../core/model';
import { ErrorHandlerService } from './../core/error-handler.service';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private route = `${environment.api_url}/pessoas`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  pesquisar(filtro: PessoaFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());

    if(filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.route}`, {params} ).pipe(
      map(res => {
        const pessoas = res.content;

        const resultado = {
          pessoas,
          total: res.totalElements
        };

        return resultado;
      })
    );
  }

  excluir(codigo: number): Observable<any> {
    return this.http.delete<any>(`${this.route}/${codigo}`).pipe(
      catchError(res => {
        this.errorHandler.handle(res);
        return null;
      })
    );
  }

  pesquisarTodas(): Observable<any> {
    return this.http.get<any>(`${this.route}`).pipe(
      map(res => res.content)
    );
  }

  mudarStatus(codigo: number, ativo: boolean): Observable<any> {
    let params = new HttpParams();
    params = params.append('ativo', ativo + '');

    return this.http.put<any>(`${this.route}/${codigo}/ativo`, ativo).pipe(
      map(res => res),
      catchError(res => {
        this.errorHandler.handle(res);
        return null;
      })
    );
  }

  salvar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.route}`, pessoa).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }

  atualizar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.route}/${pessoa.codigo}`, pessoa).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }

  buscarPorCodigo(codigo: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.route}/${codigo}`).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }
}
