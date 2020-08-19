import { LazyLoadEvent } from 'primeng/api';
import { PessoaService } from './../pessoa.service';
import { Component, OnInit } from '@angular/core';
import { PessoaFiltro } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  public totalRegistros = 0;
  public filtro = new PessoaFiltro();
  pessoas = [];

  constructor(
    private servive: PessoaService
    ) { }

  ngOnInit() {}

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.servive.pesquisar(this.filtro).subscribe((response: any) => {
      this.pessoas = response.pessoas;
      this.totalRegistros = response.total;
    });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }
}
