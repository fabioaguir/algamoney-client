
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { Lancamento } from './../core/model';
import { ErrorHandlerService } from './../core/error-handler.service';

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

  private route = `${environment.api_url}/lancamentos`;

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

    return this.http.get<any>(`${this.route}/resumir`, {params} ).pipe(
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
    return this.http.delete<any>(`${this.route}/${codigo}`).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }

  salvar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.route}`, lancamento).pipe(
      catchError(res => this.errorHandler.handle(res))
    );
  }

  atualizar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.put<Lancamento>(`${this.route}/${lancamento.codigo}`, lancamento).pipe(
      map((lanc: Lancamento) => {
        this.converterStringsParaDatas([lanc]);
        return lanc;
      }),
      catchError(res => this.errorHandler.handle(res))
    );
  }

  buscarPorCodigo(codigo: number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.route}/${codigo}`).pipe(
      map((lanc: Lancamento) => {
        this.converterStringsParaDatas([lanc]);
        return lanc;
      }),
      catchError(res => this.errorHandler.handle(res))
    );
  }

  urlUploadAnexo(): string {
    return `${this.route}/anexo`;
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    lancamentos.forEach(lanc => {
      lanc.dataVencimento = lanc.dataVencimento ? moment(lanc.dataVencimento, 'YYYY-MM-DD').toDate() : null;
      lanc.dataPagamento = lanc.dataPagamento ? moment(lanc.dataPagamento, 'YYYY-MM-DD').toDate() : null;
    });
  }
}
