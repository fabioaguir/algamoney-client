import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private route = 'http://localhost:8080/pessoas';

  private headers =  new HttpHeaders({
    Authorization : 'basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='
  });

  constructor(private http: HttpClient) { }

  pesquisar(filtro: PessoaFiltro): Observable<any> {
    let params = new HttpParams();

    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());

    if(filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.route}`, {headers: this.headers, params} ).pipe(
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

  pesquisarTodas(): Observable<any> {
    return this.http.get<any>(`${this.route}`, {headers: this.headers}).pipe(
      map(res => res.content)
    );
  }
}
