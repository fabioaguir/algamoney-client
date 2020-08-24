import { Lancamento } from './../core/model';
import { ErrorHandlerService } from './../core/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';


export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private route = 'http://localhost:8080/lancamentos';

  private headers =  new HttpHeaders({
    Authorization : 'basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
  });

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
    ) { }

  pesquisar(filtro: LancamentoFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());

    if(filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }

    if(filtro.dataVencimentoInicio) {
      params = params.append('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if(filtro.dataVencimentoFim) {
      params = params.append('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.route}/resumir`, {headers: this.headers, params} ).pipe(
      map(res => {
        const lancamentos = res.content;

        const resultado = {
          lancamentos,
          total: res.totalElements
        };

        return resultado;
      }),
      catchError(res => this.errorHandler.handle(res))
    );
  }

  excluir(codigo: number): Observable<any> {
    return this.http.delete<any>(`${this.route}/${codigo}`, {headers: this.headers}).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }

  salvar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.route}`, lancamento, {headers: this.headers}).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }
}
