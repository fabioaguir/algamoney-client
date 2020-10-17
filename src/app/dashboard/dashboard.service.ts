
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DashboardService {

  private route = `${environment.api_url}/lancamentos`;

  constructor(private http: HttpClient) {}

  lancamentosPorCategoria(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.route}/estatisticas/por-categoria`);
  }

  lancamentosPorDia(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.route}/estatisticas/por-dia`).pipe(
      map((response) => {
        const dados = response;
        this.converterStringsParaDatas(dados);

        return dados;
      })
    );
  }

  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }
}
